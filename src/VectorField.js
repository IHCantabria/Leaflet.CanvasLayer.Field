import Vector from './Vector';
import Field from './Field';
import ScalarField from './ScalarField';

/**
 *  A set of vectors assigned to a regular 2D-grid (lon-lat)
 *  (e.g. a raster representing winds for a region)
 */
export default class VectorField extends Field {
    /**
     * Creates a VectorField from the content of two ASCIIGrid files
     * @param   {String} ascU - with u-component
     * @param   {String} ascV - with v-component
     * @returns {VectorField}
     */
    static fromASCIIGrids(ascU, ascV, scaleFactor = 1) {
        let u = ScalarField.fromASCIIGrid(ascU, scaleFactor);
        let v = ScalarField.fromASCIIGrid(ascV, scaleFactor);
        let p = VectorField._paramsFromScalarFields(u, v);

        return new VectorField(p);
    }

    /**
     * Creates a VectorField from the content of two different Geotiff files
     * @param   {ArrayBuffer} gtU - geotiff data with u-component (band 0)
     * @param   {ArrayBuffer} gtV - geotiff data with v-component (band 0)
     * @returns {VectorField}
     */
    static fromGeoTIFFs(gtU, gtV) {
        let u = ScalarField.fromGeoTIFF(gtU);
        let v = ScalarField.fromGeoTIFF(gtV);
        let p = VectorField._paramsFromScalarFields(u, v);

        return new VectorField(p);
    }

    /**
     * Creates a VectorField from the content of Multiband Geotiff
     * @param   {ArrayBuffer} geotiffData - multiband
     * @param   {Array} bandIndexesForUV
     * @returns {VectorField}
     */
    static fromMultibandGeoTIFF(geotiffData, bandIndexesForUV = [0, 1]) {
        let [u, v] = ScalarField.multipleFromGeoTIFF(
            geotiffData,
            bandIndexesForUV
        );
        let p = VectorField._paramsFromScalarFields(u, v);

        return new VectorField(p);
    }

    /**
     * Build parameters for VectorField, from 2 ScalarFields.
     * No validation at all (nor interpolation) is applied, so u and v
     * must be 'compatible' from the source
     * @param   {ScalarField} u
     * @param   {ScalarField} v
     * @returns {Object} - parameters to build VectorField
     */
    static _paramsFromScalarFields(u, v) {
        // TODO check u & v compatibility (cellSize...)
        let p = {
            nCols: u.nCols,
            nRows: u.nRows,
            xllCorner: u.xllCorner,
            yllCorner: u.yllCorner,
            cellXSize: u.cellXSize,
            cellYSize: u.cellYSize,
            us: u.zs,
            vs: v.zs
        };
        return p;
    }

    constructor(params) {
        super(params);

        this.us = params['us'];
        this.vs = params['vs'];
        this.grid = this._buildGrid();
        this.range = this._calculateRange();
    }

    /**
     * Get a derived field, from a computation on
     * the VectorField
     * @param   {String} type ['magnitude' | 'directionTo' | 'directionFrom']
     * @returns {ScalarField}
     */
    getScalarField(type) {
        let f = this._getFunctionFor(type);
        let p = {
            nCols: this.params.nCols,
            nRows: this.params.nRows,
            xllCorner: this.params.xllCorner,
            yllCorner: this.params.yllCorner,
            cellXSize: this.params.cellXSize,
            cellYSize: this.params.cellYSize,
            zs: this._applyOnField(f)
        };
        return new ScalarField(p);
    }

    _getFunctionFor(type) {
        return function(u, v) {
            let uv = new Vector(u, v);
            return uv[type](); // magnitude, directionTo, directionFrom
        };
    }

    _applyOnField(func) {
        let zs = [];
        let n = this.numCells();
        for (var i = 0; i < n; i++) {
            let u = this.us[i];
            let v = this.vs[i];
            if (this._isValid(u) && this._isValid(v)) {
                zs.push(func(u, v));
            } else {
                zs.push(null);
            }
        }
        return zs;
    }

    /**
     * Builds a grid with a Vector at each point, from two arrays
     * 'us' and 'vs' following x-ascending & y-descending order
     * (same as in ASCIIGrid)
     * @returns {Array.<Array.<Vector>>} - grid[row][column]--> Vector
     */
    _buildGrid() {
        let grid = this._arraysTo2d(this.us, this.vs, this.nRows, this.nCols);
        return grid;
    }

    _arraysTo2d(us, vs, nRows, nCols) {
        let grid = [];
        let p = 0;

        for (var j = 0; j < nRows; j++) {
            var row = [];
            for (var i = 0; i < nCols; i++, p++) {
                let u = us[p],
                    v = vs[p];
                let valid = this._isValid(u) && this._isValid(v);
                row[i] = valid ? new Vector(u, v) : null; // <<<
            }
            grid[j] = row;
        }
        return grid;
    }

    _newDataArrays(params) {
        params['us'] = [];
        params['vs'] = [];
    }
    _pushValueToArrays(params, value) {
        //console.log(value);
        params['us'].push(value.u);
        params['vs'].push(value.v);
    }
    _makeNewFrom(params) {
        return new VectorField(params);
    }

    /**
     * Calculate min & max values (magnitude)
     * @private
     * @returns {Array}
     */
    _calculateRange() {
        // TODO make a clearer method for getting these vectors...
        let vectors = this.getCells()
            .map(pt => pt.value)
            .filter(function(v) {
                return v !== null;
            });

        if (this._inFilter) {
            vectors = vectors.filter(this._inFilter);
        }

        // TODO check memory crash with high num of vectors!
        let magnitudes = vectors.map(v => v.magnitude());
        let min = d3.min(magnitudes);
        let max = d3.max(magnitudes);

        return [min, max];
    }

    /**
     * Bilinear interpolation for Vector
     * https://en.wikipedia.org/wiki/Bilinear_interpolation
     * @param   {Number} x
     * @param   {Number} y
     * @param   {Number[]} g00
     * @param   {Number[]} g10
     * @param   {Number[]} g01
     * @param   {Number[]} g11
     * @returns {Vector}
     */
    _doInterpolation(x, y, g00, g10, g01, g11) {
        var rx = 1 - x;
        var ry = 1 - y;
        var a = rx * ry,
            b = x * ry,
            c = rx * y,
            d = x * y;
        var u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
        var v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
        return new Vector(u, v);
    }

    /**
     * Is valid (not 'null' nor 'undefined')
     * @private
     * @param   {Object} x object
     * @returns {Boolean}
     */
    _isValid(x) {
        return x !== null && x !== undefined;
    }
}
