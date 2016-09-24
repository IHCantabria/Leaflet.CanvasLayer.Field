/**
 *  A set of vectors assigned to a regular 2D-grid (lon-lat)
 *  (e.g. a raster representing winds for a region)
 */
class VectorField extends Field {

    constructor(params) {
        super(params);
        this.grid = this._buildGrid(params["us"], params["vs"]);
    }

    /**
     * Builds a grid with a Vector at each point, from two arrays
     * ('us' and 'vs'), following x-ascending & y-descending order
     * (same as in ASCIIGrid)
     * @private
     * @param   {Object} params - with u & v values
     * @returns {Array.<Array.<Vector>>} - grid[row][column]--> Vector
     */
    _buildGrid(us, vs) {
        let grid = [];
        let p = 0;

        for (var j = 0; j < this.nrows; j++) {
            var row = [];
            for (var i = 0; i < this.ncols; i++, p++) {
                // x-ascending & y-descending
                let u = us[p],
                    v = vs[p];
                let valid = (this._isValid(u) && this._isValid(v));
                row[i] = (valid) ? new Vector(u, v) : null; // <<<
            }
            grid[j] = row;
        }
        return grid;
    }

    /**
     * Interpolated Vector values at a point
     * @private
     * @param {Number} lon - longitude
     * @param {Number} lat - latitude
     * @returns {Number[]}  [u, v, magnitude]
     *
     * Source: https://github.com/cambecc/earth > product.js
     */
    _interpolate(lon, lat) {
        //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
        //        fi  i   ci          four points "G" that enclose point (i, j). These points are at the four
        //         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
        //      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
        //    j ___|_ .   |           (1, 9) and (2, 9).
        //  =8.3   |      |
        //      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
        //         |      |           column, so the index ci can be used without taking a modulo.


        // indexes (decimals)
        let lon0 = this.xllcorner + (this.cellsize / 2.0);
        let i = (lon - lon0) / this.cellsize;

        let lat0 = this.yurcorner - (this.cellsize / 2.0);
        let j = (lat0 - lat) / this.cellsize;

        // indexes (integers), for the 4-surrounding cells to the point (i, j)...
        let fi = Math.floor(i);
        let ci = fi + 1;
        let fj = Math.floor(j);
        let cj = fj + 1;

        //console.log(fi, ci, fj, cj);

        // vector values for the 4-cells
        var row;

        if ((row = this.grid[fj])) { // upper row ^^
            var g00 = row[fi]; // << left
            var g10 = row[ci]; // right >>
            if (this._isValid(g00) && this._isValid(g10) && (row = this.grid[cj])) { // lower row vv
                var g01 = row[fi]; // << left
                var g11 = row[ci]; // right >>
                if (this._isValid(g01) && this._isValid(g11)) {
                    // 4 values found! --> interpolation
                    //console.log(g00, g10, g01, g11);
                    return this._bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
                }
            }
        }
        // console.log("cannot interpolate: " + λ + "," + φ + ": " + fi + " " + ci + " " + fj + " " + cj);
        return null;
    }

    /**
     * Bilinear interpolation
     * https://en.wikipedia.org/wiki/Bilinear_interpolation
     * @param   {Number} x
     * @param   {Number} y
     * @param   {Number[]} g00
     * @param   {Number[]} g10
     * @param   {Number[]} g01
     * @param   {Number[]} g11
     * @returns {Vector}
     */
    _bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
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

    /**
     * TODO Check memory fail!
     * Magnitude range
     * @returns {Number[]} [min, max]
     */
    magnitudeRange() {
        let vectors = this.gridLonLatValue().map(pt => pt[2]);
        let magnitudes = vectors.map(v => v.magnitude());
        // TODO memory crash!
        let min = Math.min(...magnitudes);
        let max = Math.max(...magnitudes);

        return [min, max];
    }

}
