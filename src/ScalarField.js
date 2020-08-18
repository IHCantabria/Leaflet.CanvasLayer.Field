import Field from './Field';

/**
 * Scalar Field
 */
export default class ScalarField extends Field {
    /**
   * Creates a ScalarField from the content of an ASCIIGrid file
   * @param   {String}   asc
   * @returns {ScalarField}
   */
    static fromASCIIGrid(asc, scaleFactor = 1) {
    //console.time('ScalarField from ASC');

        let lines = asc.split('\n');

        // Header
        var header = ScalarField._parseASCIIGridHeader(lines.slice(0, 6));

        // Data (left-right and top-down)
        let zs = [];
        for (let i = 6; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === '') break;

            let items = line.split(' ');
            items.forEach((it) => {
                let floatItem = parseFloat(it);
                let v =
          floatItem !== header.noDataValue ? floatItem * scaleFactor : null;
                zs.push(v);
            });
        }
        let p = header;
        p.zs = zs;

        //console.timeEnd('ScalarField from ASC');
        return new ScalarField(p);
    }

    /**
   * Parse an ASCII Grid header, made with 6 lines
   * It allows the use of XLLCORNER/YLLCORNER or XLLCENTER/YLLCENTER conventions
   * @param {Array.String} headerLines
   */
    static _parseASCIIGridHeader(headerLines) {
        try {
            const headerItems = headerLines.map((line) => {
                var items = line.split(' ').filter((i) => i != '');
                var param = items[0].trim().toUpperCase();
                var value = parseFloat(items[1].trim());
                return {
                    [param]: value,
                };
            });

            const usesCorner = 'XLLCORNER' in headerItems[2];
            const cellSize = headerItems[4]['CELLSIZE'];

            const header = {
                nCols: parseInt(headerItems[0]['NCOLS']),
                nRows: parseInt(headerItems[1]['NROWS']),
                xllCorner: usesCorner
                    ? headerItems[2]['XLLCORNER']
                    : headerItems[2]['XLLCENTER'] - cellSize / 2,
                yllCorner: usesCorner
                    ? headerItems[3]['YLLCORNER']
                    : headerItems[3]['YLLCENTER'] - cellSize / 2,
                cellXSize: cellSize,
                cellYSize: cellSize,
                noDataValue: headerItems[5]['NODATA_VALUE'],
            };
            return header;
        } catch (err) {
            throw new Error(`Not a valid ASCIIGrid Header: ${err}`);
        }
    }

    /**
   * Creates a ScalarField from the content of a GeoTIFF file
   * @param   {ArrayBuffer}   data
   * @param   {Number}   bandIndex
   * @returns {ScalarField}
   */
    static fromGeoTIFF(data, bandIndex = 0) {
        return ScalarField.multipleFromGeoTIFF(data, [bandIndex])[0];
    }

    /**
   * Creates a ScalarField array (one per band) from the content of a GeoTIFF file
   * @param   {ArrayBuffer}   data
   * @param   {Array}   bandIndexes - if not provided all bands are returned
   * @returns {Array.<ScalarField>}
   */
    static multipleFromGeoTIFF(data, bandIndexes) {
    //console.time('ScalarField from GeoTIFF');

        let tiff = GeoTIFF.parse(data); // geotiff.js
        let image = tiff.getImage();
        let rasters = image.readRasters();
        let tiepoint = image.getTiePoints()[0];
        let fileDirectory = image.getFileDirectory();
        let [xScale, yScale] = fileDirectory.ModelPixelScale;

        if (typeof bandIndexes === 'undefined' || bandIndexes.length === 0) {
            bandIndexes = [...Array(rasters.length).keys()];
        }

        let scalarFields = [];
        scalarFields = bandIndexes.map(function (bandIndex) {
            let zs = rasters[bandIndex]; // left-right and top-down order

            if (fileDirectory.GDAL_NODATA) {
                let noData = parseFloat(fileDirectory.GDAL_NODATA);
                // console.log(noData);
                let simpleZS = Array.from(zs); // to simple array, so null is allowed | TODO efficiency??
                zs = simpleZS.map(function (z) {
                    return z === noData ? null : z;
                });
            }

            let p = {
                nCols: image.getWidth(),
                nRows: image.getHeight(),
                xllCorner: tiepoint.x,
                yllCorner: tiepoint.y - image.getHeight() * yScale,
                cellXSize: xScale,
                cellYSize: yScale,
                zs: zs,
            };
            return new ScalarField(p);
        });

        //console.timeEnd('ScalarField from GeoTIFF');
        return scalarFields;
    }

    constructor(params) {
        super(params);
        this.zs = params['zs'];

        this.grid = this._buildGrid();
        this._updateRange();
    //console.log(`ScalarField created (${this.nCols} x ${this.nRows})`);
    }

    /**
   * Builds a grid with a Number at each point, from an array
   * 'zs' following x-ascending & y-descending order
   * (same as in ASCIIGrid)
   * @private
   * @returns {Array.<Array.<Number>>} - grid[row][column]--> Number
   */
    _buildGrid() {
        let grid = this._arrayTo2d(this.zs, this.nRows, this.nCols);
        return grid;
    }

    _arrayTo2d(array, nRows, nCols) {
        let grid = [];
        let p = 0;
        for (var j = 0; j < nRows; j++) {
            var row = [];
            for (var i = 0; i < nCols; i++, p++) {
                let z = array[p];
                row[i] = this._isValid(z) ? z : null; // <<<
            }
            grid[j] = row;
        }
        return grid;
    }

    _newDataArrays(params) {
        params['zs'] = [];
    }

    _pushValueToArrays(params, value) {
        params['zs'].push(value);
    }

    _makeNewFrom(params) {
        return new ScalarField(params);
    }

    /**
   * Calculate min & max values
   * @private
   * @returns {Array} - [min, max]
   */
    _calculateRange() {
        var data = this.zs;
        if (this._inFilter) {
            data = data.filter(this._inFilter);
        }
        return [d3.min(data), d3.max(data)];
    }

    /**
   * Bilinear interpolation for Number
   * https://en.wikipedia.org/wiki/Bilinear_interpolation
   * @param   {Number} x
   * @param   {Number} y
   * @param   {Number} g00
   * @param   {Number} g10
   * @param   {Number} g01
   * @param   {Number} g11
   * @returns {Number}
   */
    _doInterpolation(x, y, g00, g10, g01, g11) {
        var rx = 1 - x;
        var ry = 1 - y;
        return g00 * rx * ry + g10 * x * ry + g01 * rx * y + g11 * x * y;
    }
}
