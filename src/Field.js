import Cell from './Cell';
import inside from '@turf/inside';

/**
 *  Abstract class for a set of values (Vector | Scalar)
 *  assigned to a regular 2D-grid (lon-lat), aka 'a Raster source'
 */
export default class Field {
    constructor(params) {
        this.params = params;

        this.nCols = params['nCols'];
        this.nRows = params['nRows'];

        // alias
        this.width = params['nCols'];
        this.height = params['nRows'];

        // ll = lower-left
        this.xllCorner = params['xllCorner'];
        this.yllCorner = params['yllCorner'];

        // ur = upper-right
        this.xurCorner =
            params['xllCorner'] + params['nCols'] * params['cellXSize'];
        this.yurCorner =
            params['yllCorner'] + params['nRows'] * params['cellYSize'];

        this.cellXSize = params['cellXSize'];
        this.cellYSize = params['cellYSize'];

        this.grid = null; // to be defined by subclasses
        this.isContinuous = this.xurCorner - this.xllCorner >= 360;
        this.longitudeNeedsToBeWrapped = this.xurCorner > 180; // [0, 360] --> [-180, 180]

        this._inFilter = null;
        this._spatialMask = null;
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

    _updateRange() {
        this.range = this._calculateRange();
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
    getCells(stride = 1) {
        let cells = [];
        for (let j = 0; j < this.nRows; j = j + stride) {
            for (let i = 0; i < this.nCols; i = i + stride) {
                let [lon, lat] = this._lonLatAtIndexes(i, j);
                let center = L.latLng(lat, lon);
                let value = this._valueAtIndexes(i, j);
                let c = new Cell(center, value, this.cellXSize, this.cellYSize);
                cells.push(c); // <<
            }
        }
        return cells;
    }

    /**
     * Apply a filter function to field values
     * @param   {Function} f - boolean function
     */
    setFilter(f) {
        this._inFilter = f;
        this._updateRange();
    }

    /**
     * Apply a spatial mask to field values
     * @param {L.GeoJSON} m 
     */
    setSpatialMask(m) {
        this._spatialMask = m;
    }

    /**
     * Grid extent
     * @returns {Number[]} [xmin, ymin, xmax, ymax]
     */
    extent() {
        let [xmin, xmax] = this._getWrappedLongitudes();
        return [xmin, this.yllCorner, xmax, this.yurCorner];
    }

    /**
     * [xmin, xmax] in [-180, 180] range
     */
    _getWrappedLongitudes() {
        let xmin = this.xllCorner;
        let xmax = this.xurCorner;

        if (this.longitudeNeedsToBeWrapped) {
            if (this.isContinuous) {
                xmin = -180;
                xmax = 180;
            } else {
                // not sure about this (just one particular case, but others...?)
                xmax = this.xurCorner - 360;
                xmin = this.xllCorner - 360;
                /* eslint-disable no-console */
                // console.warn(`are these xmin: ${xmin} & xmax: ${xmax} OK?`);
                // TODO: Better throw an exception on no-controlled situations.
                /* eslint-enable no-console */
            }
        }
        return [xmin, xmax];
    }

    /**
     * Returns whether or not the grid contains the point, considering
     * the spatialMask if it has been previously set
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    contains(lon, lat) {
        if (this._spatialMask) {
            return this._pointInMask(lon, lat);
        }
        return this._pointInExtent(lon, lat);
    }

    /**
     * Checks if coordinates are inside the Extent (considering wrapped longitudes if needed)
     * @param {Number} lon 
     * @param {Number} lat 
     */
    _pointInExtent(lon, lat) {
        let [xmin, xmax] = this._getWrappedLongitudes();
        let longitudeIn = lon >= xmin && lon <= xmax;
        let latitudeIn = lat >= this.yllCorner && lat <= this.yurCorner;
        return longitudeIn && latitudeIn;
    }

    /**
     * Check if coordinates are inside the spatialMask (Point in Polygon analysis)
     * @param {Number} lon 
     * @param {Number} lat 
     */
    _pointInMask(lon, lat) {
        const pt = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lon, lat] // geojson, lon-lat order !
            },
            properties: {}
        };
        const poly = this._spatialMask;
        return inside(pt, poly);
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
     * Interpolated value at lon-lat coordinates (bilinear method)
     * @param   {Number} longitude
     * @param   {Number} latitude
     * @returns {Vector|Number} [u, v, magnitude]
     *                          
     * Source: https://github.com/cambecc/earth > product.js
     */
    interpolatedValueAt(lon, lat) {
        if (this.notContains(lon, lat)) return null;

        let [i, j] = this._getDecimalIndexes(lon, lat);
        return this.interpolatedValueAtIndexes(i, j);
    }

    /**
     * Interpolated value at i-j indexes (bilinear method)
     * @param   {Number} i
     * @param   {Number} j
     * @returns {Vector|Number} [u, v, magnitude]
     *
     * Source: https://github.com/cambecc/earth > product.js
     */
    interpolatedValueAtIndexes(i, j) {
        //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
        //        fi  i   ci          four points 'G' that enclose point (i, j). These points are at the four
        //         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
        //      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
        //    j ___|_ .   |           (1, 9) and (2, 9).
        //  =8.3   |      |
        //      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
        //         |      |           column, so the index ci can be used without taking a modulo.

        let indexes = this._getFourSurroundingIndexes(i, j);
        let [fi, ci, fj, cj] = indexes;
        let values = this._getFourSurroundingValues(fi, ci, fj, cj);
        if (values) {
            let [g00, g10, g01, g11] = values;
            return this._doInterpolation(i - fi, j - fj, g00, g10, g01, g11);
        }
        return null;
    }

    /**
     * Get decimal indexes
     * @private
     * @param {Number} lon
     * @param {Number} lat
     * @returns {Array}    [[Description]]
     */
    _getDecimalIndexes(lon, lat) {
        if (this.longitudeNeedsToBeWrapped && lon < this.xllCorner) {
            lon = lon + 360;
        }
        let i = (lon - this.xllCorner) / this.cellXSize;
        let j = (this.yurCorner - lat) / this.cellYSize;
        return [i, j];
    }

    /**
     * Get surrounding indexes (integer), clampling on borders
     * @private
     * @param   {Number} i - decimal index
     * @param   {Number} j - decimal index
     * @returns {Array} [fi, ci, fj, cj]
     */
    _getFourSurroundingIndexes(i, j) {
        let fi = Math.floor(i);
        let ci = fi + 1;
        // duplicate colum to simplify interpolation logic (wrapped value)
        if (this.isContinuous && ci >= this.nCols) {
            ci = 0;
        }
        ci = this._clampColumnIndex(ci);

        let fj = this._clampRowIndex(Math.floor(j));
        let cj = this._clampRowIndex(fj + 1);

        return [fi, ci, fj, cj];
    }

    /**
     * Get four surrounding values or null if not available,
     * from 4 integer indexes
     * @private
     * @param   {Number} fi
     * @param   {Number} ci
     * @param   {Number} fj
     * @param   {Number} cj
     * @returns {Array} 
     */
    _getFourSurroundingValues(fi, ci, fj, cj) {
        var row;
        if ((row = this.grid[fj])) {
            // upper row ^^
            var g00 = row[fi]; // << left
            var g10 = row[ci]; // right >>
            if (
                this._isValid(g00) &&
                this._isValid(g10) &&
                (row = this.grid[cj])
            ) {
                // lower row vv
                var g01 = row[fi]; // << left
                var g11 = row[ci]; // right >>
                if (this._isValid(g01) && this._isValid(g11)) {
                    return [g00, g10, g01, g11]; // 4 values found!
                }
            }
        }
        return null;
    }

    /**
     * Nearest value at lon-lat coordinates
     * @param   {Number} longitude
     * @param   {Number} latitude
     * @returns {Vector|Number}
     */
    valueAt(lon, lat) {
        if (this.notContains(lon, lat)) return null;

        let [i, j] = this._getDecimalIndexes(lon, lat);
        let ii = Math.floor(i);
        let jj = Math.floor(j);

        const ci = this._clampColumnIndex(ii);
        const cj = this._clampRowIndex(jj);

        let value = this._valueAtIndexes(ci, cj);
        if (this._inFilter) {
            if (!this._inFilter(value)) return null;
        }

        return value;
    }

    /**
     * Returns whether or not the field has a value at the point
     * @param   {Number} lon - longitude
     * @param   {Number} lat - latitude
     * @returns {Boolean}
     */
    hasValueAt(lon, lat) {
        let value = this.valueAt(lon, lat);
        let hasValue = value !== null;

        let included = true;
        if (this._inFilter) {
            included = this._inFilter(value);
        }
        return hasValue && included;
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
        let i = (Math.random() * this.nCols) | 0;
        let j = (Math.random() * this.nRows) | 0;

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
        let halfXPixel = this.cellXSize / 2.0;
        let lon = this.xllCorner + halfXPixel + i * this.cellXSize;
        if (this.longitudeNeedsToBeWrapped) {
            lon = lon > 180 ? lon - 360 : lon;
        }
        return lon;
    }

    /**
     * Latitude for grid-index
     * @param   {Number} j - row index (integer)
     * @returns {Number} latitude at the center of the cell
     */
    _latitudeAtY(j) {
        let halfYPixel = this.cellYSize / 2.0;
        return this.yurCorner - halfYPixel - j * this.cellYSize;
    }

    /**
     * Apply the interpolation
     * @abstract
     * @private
     */
    /* eslint-disable no-unused-vars */
    _doInterpolation(x, y, g00, g10, g01, g11) {
        throw new TypeError('Must be overriden');
    }
    /* eslint-disable no-unused-vars */

    /**
     * Check the column index is inside the field,
     * adjusting to min or max when needed
     * @private
     * @param   {Number} ii - index
     * @returns {Number} i - inside the allowed indexes
     */
    _clampColumnIndex(ii) {
        let i = ii;
        if (ii < 0) {
            i = 0;
        }
        let maxCol = this.nCols - 1;
        if (ii > maxCol) {
            i = maxCol;
        }
        return i;
    }

    /**
     * Check the row index is inside the field,
     * adjusting to min or max when needed
     * @private
     * @param   {Number} jj index
     * @returns {Number} j - inside the allowed indexes
     */
    _clampRowIndex(jj) {
        let j = jj;
        if (jj < 0) {
            j = 0;
        }
        let maxRow = this.nRows - 1;
        if (jj > maxRow) {
            j = maxRow;
        }
        return j;
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
