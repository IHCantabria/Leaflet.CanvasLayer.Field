import Cell from './Cell';

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

        this.nCols = params['nCols'];
        this.nRows = params['nRows'];

        // ll = lower-left
        this.xllCorner = params['xllCorner'];
        this.yllCorner = params['yllCorner'];

        // ur = upper-right
        this.xurCorner = params['xllCorner'] + params['nCols'] * params['cellSize'];
        this.yurCorner = params['yllCorner'] + params['nRows'] * params['cellSize'];

        this.cellSize = params['cellSize'];

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
        return this.nRows * this.nCols;
    }

    /**
     * A list with every cell
     * @returns {Array<Cell>} - cells (x-ascending & y-descending order)
     */
    getCells() {
        return this.getPyramid(1); // full pyramid level
    }

    /**
     * A raster pyramid (a subset of the cells, corresponding to the pyramidLevel)
     * @param   {Number} pyramidLevel
     * @returns {Array<Cell>} - cells
     */
    getPyramid(pyramidLevel) {
        // TODO implement cache
        console.time('getCellsFor');

        let step = pyramidLevel; // 1 = all | 2 = quarter part...

        let cellSize = (this.cellSize * step);
        let cells = [];

        let halfCell = cellSize / 2.0;
        let centerLon = this.xllCorner + halfCell;
        let centerLat = this.yurCorner - halfCell;

        let lon = centerLon;
        let lat = centerLat;

        for (var j = 0; j < this.nRows / step; j++) {
            for (var i = 0; i < this.nCols / step; i++) {
                cells.push(this._getCellFor(lat, lon, cellSize)); // <<
                lon += cellSize;
            }
            lat -= cellSize;
            lon = centerLon;
        }

        console.timeEnd('getCellsFor');
        return cells;
    }

    _getCellFor(lat, lon, cellSize) {
        //let v = this._valueAtIndexes(i, j); // <<< valueAt i,j (vector or scalar) // TODO
        let center = L.latLng(lat, lon);
        let value = this._interpolate(lon, lat);
        let c = new Cell(center, value, cellSize);
        return c;
    }

    /**
     * A full list with possible pyramid levels
     * @returns {[[Type]]} [[Description]]
     */
    getPyramidLevels() {
        let pyramids = [];

        let p = 1;
        while (this.nCols / p > 1) {
            pyramids.push(p);
            p = p * 2;
        }

        return pyramids;
    }

    /**
     * A list with all available resolutions (meters per pixel), one
     * for each of the pyramid levels
     */
    getResolutions() {
        return [];
        /*
                let resolutions = pyramids.map(this.resolutionForPyramid);
                */

    }

    /**
     * Grid extent
     * @returns {Number[]} [xmin, ymin, xmax, ymax]
     */
    extent() {
        return [this.xllCorner, this.yllCorner, this.xurCorner, this.yurCorner];
    }

    /**
     * Returns whether or not the grid contains the point
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    contains(lon, lat) {
        return (lon >= this.xllCorner &&
            lon <= this.xurCorner &&
            lat >= this.yllCorner &&
            lat <= this.yurCorner);
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
     * @param   {Number} longitude
     * @param   {Number} latitude
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
        let i = Math.random() * this.nCols | 0;
        let j = Math.random() * this.nRows | 0;

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
        let halfPixel = this.cellSize / 2.0;
        return this.xllCorner + halfPixel + (i * this.cellSize);
    }

    /**
     * Latitude for grid-index
     * @param   {Number} j - row index (integer)
     * @returns {Number} latitude at the center of the cell
     */
    _latitudeAtY(j) {
        let halfPixel = this.cellSize / 2.0;
        return this.yurCorner - halfPixel - (j * this.cellSize);
    }

    /**
     * Interpolate Value at a point
     * @private
     * @param {Number} lon - longitude
     * @param {Number} lat - latitude
     * @returns {Vector|Number}
     *
     * Source: https://github.com/cambecc/earth > product.js
     * 
     * TODO --> lat, lon order
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
        let lon0 = this.xllCorner + (this.cellSize / 2.0);
        let ii = (lon - lon0) / this.cellSize;

        let lat0 = this.yurCorner - (this.cellSize / 2.0);
        let jj = (lat0 - lat) / this.cellSize;

        console.log('pre', ii, jj);
        let [i, j] = this._adjustIndexesIfNeeded(ii, jj);
        console.log('post', i, j);

        // indexes (integers), for the 4-surrounding cells to the point (i, j)...
        let fi = Math.floor(i);
        let ci = fi + 1;
        let fj = Math.floor(j);
        let cj = fj + 1;

        console.log(fi, ci, fj, cj);

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
     * Check the indexes are inside the field, 
     * adjusting to min or max when needed (+1 or -1 pixels)
     * @private
     * @param   {Number} ii decimal index
     * @param   {Number} jj decimal index
     * @returns {Array} (i, j) inside the allowed indexes
     */
    _adjustIndexesIfNeeded(ii, jj) {
        let i = ii;
        if (ii < 0) {
            i = ii + 1;
        }
        if (ii > (this.nCols - 1)) {
            i = ii - 1;
        }

        let j = jj;
        if (jj < 0) {
            j = jj + 1;
        }
        if (jj > (this.nRows - 1)) {
            j = jj - 1;
        }

        return [i, j];
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
