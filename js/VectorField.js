/**
 *  A set of vectors assigned to regular 2D-grid (lon-lat)
 *
 *  U & V values follow row-major order, as in ASCIIGrid (left->right & top ->down)
 */
class VectorField {
    constructor(params) {
        this.ncols = params["ncols"];
        this.nrows = params["nrows"];

        // ll = lower-left
        this.xllcorner = params["xllcorner"];
        this.yllcorner = params["yllcorner"];

        // ur = upper-right
        this.xurcorner = params["xllcorner"] + params["ncols"] * params["dx"];
        this.yurcorner = params["yllcorner"] + params["nrows"] * params["dy"];

        this.dx = params["dx"];
        this.dy = params["dy"];

        this.grid = this._buildGrid(params["us"], params["vs"]);
    }

    /**
     * Constructor from .json file
     * @param   {Object} d - data from a vectorgrid.json file
     * @returns {VectorField}
     */
    static fromJson(d) {
        let params = {
            "ncols": d.ncols,
            "nrows": d.nrows,
            "xllcorner": d.xllcorner,
            "yllcorner": d.yllcorner,
            "dx": d.dx,
            "dy": d.dy,
            "us": d.us,
            "vs": d.vs
        };

        let vf = new VectorField(params);
        return vf;
    }

    /**
     * Number of cells in the grid (rows * cols)
     * @returns {Number}
     */
    numCells() {
        return this.nrows * this.ncols;
    }

    /**
     * A list with every point in the grid, including [lon, lat, u, v]
     * @returns {Array.<Number[]>} - grid values
     */
    gridLonLatUV() {
        let lonslatsUV = [];
        let lon = this.xllcorner;
        let lat = this.yllcorner;
        for (var j = 0; j < this.nrows; j++) {
            for (var i = 0; i < this.ncols; i++) {
                let uv = this._vector(i, j);
                lonslatsUV.push([lon, lat, uv[0], uv[1]]); // <<
                lon += this.dx;
            }
            lat += this.dy;
            lon = this.xllcorner;
        }
        return lonslatsUV;
    }

    /**
     * Grid extent
     * @returns {Array} [xmin, ymin, xmax, ymax]
     */
    extent() {
        return [this.xllcorner, this.yllcorner, this.xurcorner, this.yurcorner];
    }

    /**
     * Returns whether or not the grid contains the point
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    contains(lon, lat) {
        return (lon >= this.xllcorner &&
            lon <= this.xurcorner &&
            lat >= this.yllcorner &&
            lat <= this.yurcorner);
    }

    /**
     * Returns if the grid doesn't contain the point
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    notContains(lon, lat) {
        return !this.contains(lon, lat);
    }


    /**
     * Vector values at lon-lat coordinates (interpolated)
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Array} [u, v]
     */
    valuesAt(lon, lat) {
        if (this.notContains(lon, lat)) return null;
        return this._interpolate(lon, lat);
    }

    /**
     * Returns whether or not the grid has vector values at the point
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    hasValuesAt(lon, lat) {
        return this.valuesAt(lon, lat) !== null;
    }

    /**
     * Returns if the grid has no vector values at the point
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    notHasValuesAt(lon, lat) {
        return !this.hasValuesAt(lon, lat);
    }


    /**
     * Gives random position to 'o', inside the grid
     */
    randomPosition(o = {}) {
        let i = _.random(0, this.ncols - 1);
        let j = _.random(0, this.nrows - 1);
        o.x = this._longitudeAtX(i);
        o.y = this._latitudeAtY(j);
        return o;
    }

    /**
     * Magnitude range
     * @returns {Array} [min, max]
     */
    magnitudeRange() {
        let vectors = this.gridLonLatUV().map(pt => new Vector(pt[2], pt[3]));
        let magnitudes = vectors.map(v => v.magnitude());
        let min = Math.min(...magnitudes);
        let max = Math.max(...magnitudes);

        return [min, max];
    }

    /**
     * Builds a grid with vector values [u,v] at each point
     * (x-ascending & y-descending order for u|v components, same as in ASCIIGrid)
     * @private
     * @param   {Number[]} us - u values
     * @param   {Number[]} vs - v values
     * @returns {Number[][][]} - grid[j][i] (rows/columns) with [u,v] values
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
                //row[i] = (valid) ? [u, v] : null;
                row[i] = (valid) ? [u, v] : [null, null];
            }
            grid[j] = row;
        }
        return grid;
    }

    /**
     * Vector values for grid indexes
     * @param   {Number} i - column index (integer)
     * @param   {Number} j - row index (integer)
     * @returns {Array} [u, v]
     */
    _vector(i, j) {
        return this.grid[j][i]; // <-- j,i !
    }

    /**
     * Lon-Lat fo grid indexes
     * @param   {Number} i - column index (integer)
     * @param   {Number} j - row index (integer)
     * @returns {Array} [lon, lat]
     */
    lonLatAtIndexes(i, j) {
        let lon = this._longitudeAtX(i);
        let lat = this._latitudeAtY(j);

        return [lon, lat];
    }

    /**
     * Longitude for grid-index
     * @param   {Number} i - column index (integer)
     * @returns {Number} longitude at cell center
     */
    _longitudeAtX(i) {
        let halfPixel = this.dx / 2.0;
        return this.xllcorner + halfPixel + (i * this.dx);
    }

    /**
     * Latitude for grid-index
     * @param   {Number} j - row index (integer)
     * @returns {Number} latitude at cell center
     */
    _latitudeAtY(j) {
        let halfPixel = this.dy / 2.0;
        return this.yurcorner - halfPixel - (j * this.dy);
    }

    /**
     * Interpolated Vector values at a point
     * @private
     * @param {Number} lon - longitude
     * @param {Number} lat - latitude
     * @returns {Array}  [u, v, magnitude]
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
        let lon0 = this.xllcorner + (this.dx / 2.0);
        let i = (lon - lon0) / this.dx;

        let lat0 = this.yurcorner - (this.dy / 2.0);
        let j = (lat0 - lat) / this.dy;

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
     * @param   {[[Type]]} x   [[Description]]
     * @param   {[[Type]]} y   [[Description]]
     * @param   {[[Type]]} g00 [[Description]]
     * @param   {[[Type]]} g10 [[Description]]
     * @param   {[[Type]]} g01 [[Description]]
     * @param   {[[Type]]} g11 [[Description]]
     * @returns {Array}    [u, v, magnitude]
     */
    _bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
        var rx = (1 - x);
        var ry = (1 - y);
        var a = rx * ry,
            b = x * ry,
            c = rx * y,
            d = x * y;
        var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
        var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
        return [u, v, Math.sqrt(u * u + v * v)];
    }


    /**
     * Is valid (not 'null' nor 'undefined')
     * @private
     * @param   {Object} x object
     * @returns {Boolean}
     */
    _isValid(x) {
        return (x !== null) && (x !== undefined);
    }
}
