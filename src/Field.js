/**
 *  Abstract class for a set of values (Vector | Scalar)
 *  assigned to a regular 2D-grid (lon-lat), aka 'a Raster source'
 */
export default class Field {

    constructor(params) {
        if (new.target === Field) {
            throw new TypeError('Cannot construct Field instances directly (use VectorField or ScalarField)');
        }
        this.params = params;

        this.ncols = params['ncols'];
        this.nrows = params['nrows'];

        // ll = lower-left
        this.xllcorner = params['xllcorner'];
        this.yllcorner = params['yllcorner'];

        // ur = upper-right
        this.xurcorner = params['xllcorner'] + params['ncols'] * params['cellsize'];
        this.yurcorner = params['yllcorner'] + params['nrows'] * params['cellsize'];

        this.cellsize = params['cellsize'];

        this.grid = null; // to be defined by subclasses
    }

    /**
     * Builds a grid with a value at each point (either Vector or Number)
     * Original params must include the required input values, following
     * x-ascending & y-descending order (same as in ASCIIGrid)
     * @abstract
     * @private
     * @returns {Array.<Array.<Vector|Number>>} - grid[row][column]--> Vector|Number
     */
    _buildGrid() {
        throw new TypeError('Must be overriden');
    }

    /**
     * Number of cells in the grid (rows * cols)
     * @returns {Number}
     */
    numCells() {
        return this.nrows * this.ncols;
    }

    /**
     * A list with every point in the grid (center of the cell), including coordinates and associated value
     * @returns {Array} - grid values {lon, lat, value}, x-ascending & y-descending
     */
    gridLonLatValue() {
        return this.gridWithStep(1); // original
        //return this.gridWithStep(2); // simplified
    }

    gridWithStep(step) {
        console.time('gridWithStep');

        let cellsize = this.cellsize * step;
        let lonslatsV = [];

        let halfCell = cellsize / 2.0;
        let centerLon = this.xllcorner + halfCell;
        let centerLat = this.yurcorner - halfCell;

        let lon = centerLon;
        let lat = centerLat;

        for (var j = 0; j < this.nrows / step; j++) {
            for (var i = 0; i < this.ncols / step; i++) {
                //let v = this._valueAtIndexes(i, j); // <<< valueAt i,j (vector or scalar) // TODO
                let v = this._interpolate(lon, lat);
                lonslatsV.push({
                    'lon': lon,
                    'lat': lat,
                    'value': v
                }); // <<
                lon += cellsize;
            }
            lat -= cellsize;
            lon = centerLon;
        }

        console.timeEnd('gridWithStep');
        return lonslatsV;
    }

    /**
     * Grid extent
     * @returns {Number[]} [xmin, ymin, xmax, ymax]
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
     * Interpolated value at lon-lat coordinates
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Vector|Number} [u, v, magnitude]
     */
    valueAt(lon, lat) {
        if (this.notContains(lon, lat)) return null;
        return this._interpolate(lon, lat);
    }

    /**
     * Returns whether or not the grid has a value at the point
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    hasValueAt(lon, lat) {
        return this.valueAt(lon, lat) !== null;
    }

    /**
     * Returns if the grid has no value at the point
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    notHasValueAt(lon, lat) {
        return !this.hasValueAt(lon, lat);
    }

    /**
     * Gives a random position to 'o' inside the grid
     * @param {Object} [o] - an object (eg. a particle)
     * @returns {{x: Number, y: Number}} - object with x, y (lon, lat)
     */
    randomPosition(o = {}) {
        let i = Math.random() * this.ncols | 0;
        let j = Math.random() * this.nrows | 0;

        o.x = this._longitudeAtX(i);
        o.y = this._latitudeAtY(j);
        return o;
    }

    /**
     * Value for grid indexes
     * @param   {Number} i - column index (integer)
     * @param   {Number} j - row index (integer)
     * @returns {Vector|Number}
     */
    _valueAtIndexes(i, j) {
        return this.grid[j][i]; // <-- j,i !!
    }

    /**
     * Lon-Lat for grid indexes
     * @param   {Number} i - column index (integer)
     * @param   {Number} j - row index (integer)
     * @returns {Number[]} [lon, lat]
     */
    _lonLatAtIndexes(i, j) {
        let lon = this._longitudeAtX(i);
        let lat = this._latitudeAtY(j);

        return [lon, lat];
    }

    /**
     * Longitude for grid-index
     * @param   {Number} i - column index (integer)
     * @returns {Number} longitude at the center of the cell
     */
    _longitudeAtX(i) {
        let halfPixel = this.cellsize / 2.0;
        return this.xllcorner + halfPixel + (i * this.cellsize);
    }

    /**
     * Latitude for grid-index
     * @param   {Number} j - row index (integer)
     * @returns {Number} latitude at the center of the cell
     */
    _latitudeAtY(j) {
        let halfPixel = this.cellsize / 2.0;
        return this.yurcorner - halfPixel - (j * this.cellsize);
    }

    /**
     * Interpolate Value at a point
     * @private
     * @param {Number} lon - longitude
     * @param {Number} lat - latitude
     * @returns {Vector|Number}
     *
     * Source: https://github.com/cambecc/earth > product.js
     */
    _interpolate(lon, lat) {
        //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
        //        fi  i   ci          four points 'G' that enclose point (i, j). These points are at the four
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

        // values for the 4-cells
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
                    return this._doInterpolation(i - fi, j - fj, g00, g10, g01, g11);
                }
            }
        }
        // console.log('cannot interpolate: ' + λ + ',' + φ + ': ' + fi + ' ' + ci + ' ' + fj + ' ' + cj);
        return null;
    }

    /**
     * Interpolation method
     * @abstract
     * @private
     * @param {Number} lon - longitude
     * @param {Number} lat - latitude
     * @returns {Vector|Number}
     */
    _doInterpolation(lon, lat) {
        throw new TypeError('Must be overriden');
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
