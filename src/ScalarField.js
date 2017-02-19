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
        console.time('ScalarField from ASC');

        let lines = asc.split('\n');

        // Header
        let n = /-?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/; // any number
        let p = {
            nCols: parseInt(lines[0].match(n)),
            nRows: parseInt(lines[1].match(n)),
            xllCorner: parseFloat(lines[2].match(n)),
            yllCorner: parseFloat(lines[3].match(n)),
            cellSize: parseFloat(lines[4].match(n))
        };
        let NODATA_value = lines[5].replace('NODATA_value', '').trim();

        // Data (left-right and top-down)
        let zs = []; //
        for (let i = 6; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === '') break;

            let items = line.split(' ');
            let values = items.map(it => {
                return (it !== NODATA_value) ? parseFloat(it * scaleFactor) : null;
            });
            zs.push(...values);
        }
        p.zs = zs;

        console.timeEnd('ScalarField from ASC');
        return new ScalarField(p);
    }

    /**
     * Creates a ScalarField from the content of a GeoTIFF file, as read by geotiff.js
     * @param   {ArrayBuffer}   data
     * @param   {Number}   bandIndex
     * @returns {ScalarField}
     */
    static fromGeoTIFF(data, bandIndex = 0) {
        console.time('ScalarField from GeoTIFF');

        let tiff = GeoTIFF.parse(data); // geotiff.js
        let image = tiff.getImage();
        let rasters = image.readRasters();
        let tiepoint = image.getTiePoints()[0];
        let fileDirectory = image.getFileDirectory();
        let pixelScale = fileDirectory.ModelPixelScale;

        let regularGrid = Math.abs(pixelScale[0] - pixelScale[1]) < 0.00000001;
        if (!regularGrid) {
            console.error(`pixelScale: ${pixelScale}`);
            throw new Error('A raster without regular cells is not supported');
        }

        // TODO check no rotation, or else ... throw "Not supported raster"
        let zs = rasters[bandIndex]; // left-right and top-down.

        if (fileDirectory.GDAL_NODATA) {
            let noData = parseFloat(fileDirectory.GDAL_NODATA); // TODO int values?
            console.log(noData);
            zs = zs.map(function (z) {
                return z === noData ? null : z;
            });
        }

        let p = {
            nCols: image.getWidth(),
            nRows: image.getHeight(),
            xllCorner: tiepoint.x,
            yllCorner: tiepoint.y - (image.getHeight() * pixelScale[0]),
            cellSize: pixelScale[0],
            zs: zs
        };

        console.timeEnd('ScalarField from GeoTIFF');
        return new ScalarField(p);
    }

    constructor(params) {
        super(params);
        this.zs = params['zs'];

        this.grid = this._buildGrid();
        this.range = this._calculateRange();

        console.log(`ScalarField created (${this.nCols} x ${this.nRows})`);
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
                row[i] = (this._isValid(z)) ? z : null; // <<<
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
     * @returns {Array}
     */
    _calculateRange() {
        return [d3.min(this.zs), d3.max(this.zs)];
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
        var rx = (1 - x);
        var ry = (1 - y);
        return g00 * rx * ry + g10 * x * ry + g01 * rx * y + g11 * x * y;
    }

}
