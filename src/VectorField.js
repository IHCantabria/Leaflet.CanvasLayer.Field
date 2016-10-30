import Field from './Field';
import ScalarField from './ScalarField';

/**
 *  A set of vectors assigned to a regular 2D-grid (lon-lat)
 *  (e.g. a raster representing winds for a region)
 */
export class VectorField extends Field {

    /**
     * Creates a VectorField from the content of two ASCIIGrid files
     * @param   {String} ascU - with u-component
     * @param   {String} ascV - with v-component
     * @returns {VectorField}
     */
    static fromASCIIGrids(ascU, ascV) {
        let u = ScalarField.fromASCIIGrid(ascU);
        let v = ScalarField.fromASCIIGrid(ascV);

        // TODO - check equal parameters for u|v

        let p = {
            ncols: u.ncols,
            nrows: u.nrows,
            xllcorner: u.xllcorner,
            yllcorner: u.yllcorner,
            cellsize: u.cellsize,
            us: u.zs,
            vs: v.zs
        };
        return new VectorField(p);
    }

    constructor(params) {
        super(params);

        this.us = params["us"];
        this.vs = params["vs"];
        this.grid = this._buildGrid();
        this.range = this._calculateRange();
    }

    /**
     * Builds a grid with a Vector at each point, from two arrays
     * 'us' and 'vs' following x-ascending & y-descending order
     * (same as in ASCIIGrid)
     * @returns {Array.<Array.<Vector>>} - grid[row][column]--> Vector
     */
    _buildGrid() {
        let grid = [];
        let p = 0;

        for (var j = 0; j < this.nrows; j++) {
            var row = [];
            for (var i = 0; i < this.ncols; i++, p++) {
                let u = this.us[p],
                    v = this.vs[p];
                let valid = (this._isValid(u) && this._isValid(v));
                row[i] = (valid) ? new Vector(u, v) : null; // <<<
            }
            grid[j] = row;
        }
        return grid;
    }

    /**
     * Calculate min & max values (magnitude)
     * @private
     * @returns {Array}
     */
    _calculateRange() {
        let vectors = this.gridLonLatValue()
            .map(pt => pt.value)
            .filter(function (v) {
                return v !== null;
            });

        let magnitudes = vectors.map(v => v.magnitude());

        // TODO memory crash!
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
        var rx = (1 - x);
        var ry = (1 - y);
        var a = rx * ry,
            b = x * ry,
            c = rx * y,
            d = x * y;
        var u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
        var v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
        return new Vector(u, v);
    }

}
