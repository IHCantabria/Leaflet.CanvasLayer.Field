/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Simple regular cell in a raster
 */
var Cell = function () {
    /**
     * A simple cell with a numerical value
     * @param {L.LatLng} center
     * @param {Number|Vector} value
     * @param {Number} xSize
     * @param {Number} ySize
     */
    function Cell(center, value, xSize) {
        var ySize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : xSize;

        _classCallCheck(this, Cell);

        this.center = center;
        this.value = value;
        this.xSize = xSize;
        this.ySize = ySize;
    }

    _createClass(Cell, [{
        key: "equals",
        value: function equals(anotherCell) {
            return this.center.equals(anotherCell.center) && this._equalValues(this.value, anotherCell.value) && this.xSize === anotherCell.xSize && this.ySize === anotherCell.ySize;
        }
    }, {
        key: "_equalValues",
        value: function _equalValues(value, anotherValue) {
            var type = value.constructor.name;
            var answerFor = {
                Number: value === anotherValue,
                Vector: value.u === anotherValue.u && value.v === anotherValue.v
            };
            return answerFor[type];
        }

        /**
         * Bounds for the cell
         * @returns {LatLngBounds}
         */

    }, {
        key: "getBounds",
        value: function getBounds() {
            var halfX = this.xSize / 2.0;
            var halfY = this.ySize / 2.0;
            var cLat = this.center.lat;
            var cLng = this.center.lng;
            var ul = L.latLng([cLat + halfY, cLng - halfX]);
            var lr = L.latLng([cLat - halfY, cLng + halfX]);

            return L.latLngBounds(L.latLng(lr.lat, ul.lng), L.latLng(ul.lat, lr.lng));
        }
    }]);

    return Cell;
}();

/* harmony default export */ __webpack_exports__["a"] = (Cell);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Cell__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__turf_inside__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__turf_inside___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__turf_inside__);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




/**
 *  Abstract class for a set of values (Vector | Scalar)
 *  assigned to a regular 2D-grid (lon-lat), aka 'a Raster source'
 */

var Field = function () {
    function Field(params) {
        _classCallCheck(this, Field);

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
        this.xurCorner = params['xllCorner'] + params['nCols'] * params['cellXSize'];
        this.yurCorner = params['yllCorner'] + params['nRows'] * params['cellYSize'];

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


    _createClass(Field, [{
        key: '_buildGrid',
        value: function _buildGrid() {
            throw new TypeError('Must be overriden');
        }
    }, {
        key: '_updateRange',
        value: function _updateRange() {
            this.range = this._calculateRange();
        }

        /**
         * Number of cells in the grid (rows * cols)
         * @returns {Number}
         */

    }, {
        key: 'numCells',
        value: function numCells() {
            return this.nRows * this.nCols;
        }

        /**
         * A list with every cell
         * @returns {Array<Cell>} - cells (x-ascending & y-descending order)
         */

    }, {
        key: 'getCells',
        value: function getCells() {
            var stride = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            var cells = [];
            for (var j = 0; j < this.nRows; j = j + stride) {
                for (var i = 0; i < this.nCols; i = i + stride) {
                    var _lonLatAtIndexes2 = this._lonLatAtIndexes(i, j),
                        _lonLatAtIndexes3 = _slicedToArray(_lonLatAtIndexes2, 2),
                        lon = _lonLatAtIndexes3[0],
                        lat = _lonLatAtIndexes3[1];

                    var center = L.latLng(lat, lon);
                    var value = this._valueAtIndexes(i, j);
                    var c = new __WEBPACK_IMPORTED_MODULE_0__Cell__["a" /* default */](center, value, this.cellXSize, this.cellYSize);
                    cells.push(c); // <<
                }
            }
            return cells;
        }

        /**
         * Apply a filter function to field values
         * @param   {Function} f - boolean function
         */

    }, {
        key: 'setFilter',
        value: function setFilter(f) {
            this._inFilter = f;
            this._updateRange();
        }

        /**
         * Apply a spatial mask to field values
         * @param {L.GeoJSON} m 
         */

    }, {
        key: 'setSpatialMask',
        value: function setSpatialMask(m) {
            this._spatialMask = m;
        }

        /**
         * Grid extent
         * @returns {Number[]} [xmin, ymin, xmax, ymax]
         */

    }, {
        key: 'extent',
        value: function extent() {
            var _getWrappedLongitudes2 = this._getWrappedLongitudes(),
                _getWrappedLongitudes3 = _slicedToArray(_getWrappedLongitudes2, 2),
                xmin = _getWrappedLongitudes3[0],
                xmax = _getWrappedLongitudes3[1];

            return [xmin, this.yllCorner, xmax, this.yurCorner];
        }

        /**
         * [xmin, xmax] in [-180, 180] range
         */

    }, {
        key: '_getWrappedLongitudes',
        value: function _getWrappedLongitudes() {
            var xmin = this.xllCorner;
            var xmax = this.xurCorner;

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

    }, {
        key: 'contains',
        value: function contains(lon, lat) {
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

    }, {
        key: '_pointInExtent',
        value: function _pointInExtent(lon, lat) {
            var _getWrappedLongitudes4 = this._getWrappedLongitudes(),
                _getWrappedLongitudes5 = _slicedToArray(_getWrappedLongitudes4, 2),
                xmin = _getWrappedLongitudes5[0],
                xmax = _getWrappedLongitudes5[1];

            var longitudeIn = lon >= xmin && lon <= xmax;
            var latitudeIn = lat >= this.yllCorner && lat <= this.yurCorner;
            return longitudeIn && latitudeIn;
        }

        /**
         * Check if coordinates are inside the spatialMask (Point in Polygon analysis)
         * @param {Number} lon 
         * @param {Number} lat 
         */

    }, {
        key: '_pointInMask',
        value: function _pointInMask(lon, lat) {
            var pt = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [lon, lat] // geojson, lon-lat order !
                },
                properties: {}
            };
            var poly = this._spatialMask;
            return __WEBPACK_IMPORTED_MODULE_1__turf_inside___default()(pt, poly);
        }

        /**
         * Returns if the grid doesn't contain the point
         * @param   {Number} lon - longitude
         * @param   {Number} lat - latitude
         * @returns {Boolean}
         */

    }, {
        key: 'notContains',
        value: function notContains(lon, lat) {
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

    }, {
        key: 'interpolatedValueAt',
        value: function interpolatedValueAt(lon, lat) {
            if (this.notContains(lon, lat)) return null;

            var _getDecimalIndexes2 = this._getDecimalIndexes(lon, lat),
                _getDecimalIndexes3 = _slicedToArray(_getDecimalIndexes2, 2),
                i = _getDecimalIndexes3[0],
                j = _getDecimalIndexes3[1];

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

    }, {
        key: 'interpolatedValueAtIndexes',
        value: function interpolatedValueAtIndexes(i, j) {
            //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
            //        fi  i   ci          four points 'G' that enclose point (i, j). These points are at the four
            //         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
            //      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
            //    j ___|_ .   |           (1, 9) and (2, 9).
            //  =8.3   |      |
            //      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
            //         |      |           column, so the index ci can be used without taking a modulo.

            var indexes = this._getFourSurroundingIndexes(i, j);

            var _indexes = _slicedToArray(indexes, 4),
                fi = _indexes[0],
                ci = _indexes[1],
                fj = _indexes[2],
                cj = _indexes[3];

            var values = this._getFourSurroundingValues(fi, ci, fj, cj);
            if (values) {
                var _values = _slicedToArray(values, 4),
                    g00 = _values[0],
                    g10 = _values[1],
                    g01 = _values[2],
                    g11 = _values[3];

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

    }, {
        key: '_getDecimalIndexes',
        value: function _getDecimalIndexes(lon, lat) {
            if (this.longitudeNeedsToBeWrapped && lon < this.xllCorner) {
                lon = lon + 360;
            }
            var i = (lon - this.xllCorner) / this.cellXSize;
            var j = (this.yurCorner - lat) / this.cellYSize;
            return [i, j];
        }

        /**
         * Get surrounding indexes (integer), clampling on borders
         * @private
         * @param   {Number} i - decimal index
         * @param   {Number} j - decimal index
         * @returns {Array} [fi, ci, fj, cj]
         */

    }, {
        key: '_getFourSurroundingIndexes',
        value: function _getFourSurroundingIndexes(i, j) {
            var fi = Math.floor(i);
            var ci = fi + 1;
            // duplicate colum to simplify interpolation logic (wrapped value)
            if (this.isContinuous && ci >= this.nCols) {
                ci = 0;
            }
            ci = this._clampColumnIndex(ci);

            var fj = this._clampRowIndex(Math.floor(j));
            var cj = this._clampRowIndex(fj + 1);

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

    }, {
        key: '_getFourSurroundingValues',
        value: function _getFourSurroundingValues(fi, ci, fj, cj) {
            var row;
            if (row = this.grid[fj]) {
                // upper row ^^
                var g00 = row[fi]; // << left
                var g10 = row[ci]; // right >>
                if (this._isValid(g00) && this._isValid(g10) && (row = this.grid[cj])) {
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

    }, {
        key: 'valueAt',
        value: function valueAt(lon, lat) {
            if (this.notContains(lon, lat)) return null;

            var _getDecimalIndexes4 = this._getDecimalIndexes(lon, lat),
                _getDecimalIndexes5 = _slicedToArray(_getDecimalIndexes4, 2),
                i = _getDecimalIndexes5[0],
                j = _getDecimalIndexes5[1];

            var ii = Math.floor(i);
            var jj = Math.floor(j);

            var ci = this._clampColumnIndex(ii);
            var cj = this._clampRowIndex(jj);

            var value = this._valueAtIndexes(ci, cj);
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

    }, {
        key: 'hasValueAt',
        value: function hasValueAt(lon, lat) {
            var value = this.valueAt(lon, lat);
            var hasValue = value !== null;

            var included = true;
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

    }, {
        key: 'notHasValueAt',
        value: function notHasValueAt(lon, lat) {
            return !this.hasValueAt(lon, lat);
        }

        /**
         * Gives a random position to 'o' inside the grid
         * @param {Object} [o] - an object (eg. a particle)
         * @returns {{x: Number, y: Number}} - object with x, y (lon, lat)
         */

    }, {
        key: 'randomPosition',
        value: function randomPosition() {
            var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var i = Math.random() * this.nCols | 0;
            var j = Math.random() * this.nRows | 0;

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

    }, {
        key: '_valueAtIndexes',
        value: function _valueAtIndexes(i, j) {
            return this.grid[j][i]; // <-- j,i !!
        }

        /**
         * Lon-Lat for grid indexes
         * @param   {Number} i - column index (integer)
         * @param   {Number} j - row index (integer)
         * @returns {Number[]} [lon, lat]
         */

    }, {
        key: '_lonLatAtIndexes',
        value: function _lonLatAtIndexes(i, j) {
            var lon = this._longitudeAtX(i);
            var lat = this._latitudeAtY(j);

            return [lon, lat];
        }

        /**
         * Longitude for grid-index
         * @param   {Number} i - column index (integer)
         * @returns {Number} longitude at the center of the cell
         */

    }, {
        key: '_longitudeAtX',
        value: function _longitudeAtX(i) {
            var halfXPixel = this.cellXSize / 2.0;
            var lon = this.xllCorner + halfXPixel + i * this.cellXSize;
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

    }, {
        key: '_latitudeAtY',
        value: function _latitudeAtY(j) {
            var halfYPixel = this.cellYSize / 2.0;
            return this.yurCorner - halfYPixel - j * this.cellYSize;
        }

        /**
         * Apply the interpolation
         * @abstract
         * @private
         */
        /* eslint-disable no-unused-vars */

    }, {
        key: '_doInterpolation',
        value: function _doInterpolation(x, y, g00, g10, g01, g11) {
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

    }, {
        key: '_clampColumnIndex',
        value: function _clampColumnIndex(ii) {
            var i = ii;
            if (ii < 0) {
                i = 0;
            }
            var maxCol = this.nCols - 1;
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

    }, {
        key: '_clampRowIndex',
        value: function _clampRowIndex(jj) {
            var j = jj;
            if (jj < 0) {
                j = 0;
            }
            var maxRow = this.nRows - 1;
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

    }, {
        key: '_isValid',
        value: function _isValid(x) {
            return x !== null && x !== undefined;
        }
    }]);

    return Field;
}();

/* harmony default export */ __webpack_exports__["a"] = (Field);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Field__ = __webpack_require__(1);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



/**
 * Scalar Field
 */

var ScalarField = function (_Field) {
    _inherits(ScalarField, _Field);

    _createClass(ScalarField, null, [{
        key: 'fromASCIIGrid',

        /**
         * Creates a ScalarField from the content of an ASCIIGrid file
         * @param   {String}   asc
         * @returns {ScalarField}
         */
        value: function fromASCIIGrid(asc) {
            var scaleFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            //console.time('ScalarField from ASC');

            var lines = asc.split('\n');

            // Header
            ScalarField._checkIsValidASCIIGridHeader(lines);

            var n = /-?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/; // any number

            var cellSize = parseFloat(lines[4].match(n)); // right now, no different x-y size is allowed
            var p = {
                nCols: parseInt(lines[0].match(n)),
                nRows: parseInt(lines[1].match(n)),
                xllCorner: parseFloat(lines[2].match(n)),
                yllCorner: parseFloat(lines[3].match(n)),
                cellXSize: cellSize,
                cellYSize: cellSize
            };
            var noDataValue = lines[5].toUpperCase().replace('NODATA_VALUE', '').trim();

            // Data (left-right and top-down)
            var zs = []; // TODO Consider using TypedArray (& manage NO_DATA)
            for (var i = 6; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line === '') break;

                var items = line.split(' ');
                items.forEach(function (it) {
                    var v = it !== noDataValue ? parseFloat(it * scaleFactor) : null;
                    zs.push(v);
                });
            }
            p.zs = zs;

            //console.timeEnd('ScalarField from ASC');
            return new ScalarField(p);
        }
    }, {
        key: '_checkIsValidASCIIGridHeader',
        value: function _checkIsValidASCIIGridHeader(lines) {
            var upperCasesLines = lines.map(function (lin) {
                return lin.toUpperCase();
            });

            var parameters = ['NCOLS', 'NROWS', 'XLLCORNER', 'YLLCORNER', 'CELLSIZE', 'NODATA_VALUE'];

            var i = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = parameters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var expected = _step.value;

                    var line = upperCasesLines[i];
                    var found = line.indexOf(expected) != -1;
                    if (!found) {
                        throw 'Not valid ASCIIGrid: expected \'' + expected + '\' at line \'' + line + '\' [lin. n\xBA ' + i + ']';
                    }
                    i++;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * Creates a ScalarField from the content of a GeoTIFF file, as read by geotiff.js
         * @param   {ArrayBuffer}   data
         * @param   {Number}   bandIndex
         * @returns {ScalarField}
         */

    }, {
        key: 'fromGeoTIFF',
        value: function fromGeoTIFF(data) {
            var bandIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            //console.time('ScalarField from GeoTIFF');

            var tiff = GeoTIFF.parse(data); // geotiff.js
            var image = tiff.getImage();
            var rasters = image.readRasters();
            var tiepoint = image.getTiePoints()[0];
            var fileDirectory = image.getFileDirectory();

            var _fileDirectory$ModelP = _slicedToArray(fileDirectory.ModelPixelScale, 2),
                xScale = _fileDirectory$ModelP[0],
                yScale = _fileDirectory$ModelP[1];

            var zs = rasters[bandIndex]; // left-right and top-down order

            if (fileDirectory.GDAL_NODATA) {
                var noData = parseFloat(fileDirectory.GDAL_NODATA);
                // console.log(noData);
                var simpleZS = Array.from(zs); // to simple array, so null is allowed | TODO efficiency??
                zs = simpleZS.map(function (z) {
                    return z === noData ? null : z;
                });
            }

            var p = {
                nCols: image.getWidth(),
                nRows: image.getHeight(),
                xllCorner: tiepoint.x,
                yllCorner: tiepoint.y - image.getHeight() * yScale,
                cellXSize: xScale,
                cellYSize: yScale,
                zs: zs
            };

            //console.timeEnd('ScalarField from GeoTIFF');
            return new ScalarField(p);
        }

        /**
         * Creates a ScalarField array from the content of a GeoTIFF file, as read by geotiff.js
         * @param   {ArrayBuffer}   data
         * @param   {Array}   bandIndex - If not provided all bands are returned
         * @returns {ScalarField array}
         */

    }, {
        key: 'multipleFromGeoTIFF',
        value: function multipleFromGeoTIFF(data, bandIndexesRaw) {
            //console.time('ScalarField from GeoTIFF');

            var tiff = GeoTIFF.parse(data); // geotiff.js
            var image = tiff.getImage();
            var rasters = image.readRasters();
            var tiepoint = image.getTiePoints()[0];
            var fileDirectory = image.getFileDirectory();

            var _fileDirectory$ModelP2 = _slicedToArray(fileDirectory.ModelPixelScale, 2),
                xScale = _fileDirectory$ModelP2[0],
                yScale = _fileDirectory$ModelP2[1];

            var bandIndexes = bandIndexesRaw;
            if (typeof bandIndexes === 'undefined' || bandIndexes.length === 0) {
                bandIndexes = [].concat(_toConsumableArray(Array(rasters.length).keys()));
            }

            var scalarFields = [];
            scalarFields = bandIndexes.map(function (bandIndex) {
                var zs = rasters[bandIndex]; // left-right and top-down order

                if (fileDirectory.GDAL_NODATA) {
                    var noData = parseFloat(fileDirectory.GDAL_NODATA);
                    // console.log(noData);
                    var simpleZS = Array.from(zs); // to simple array, so null is allowed | TODO efficiency??
                    zs = simpleZS.map(function (z) {
                        return z === noData ? null : z;
                    });
                }

                var p = {
                    nCols: image.getWidth(),
                    nRows: image.getHeight(),
                    xllCorner: tiepoint.x,
                    yllCorner: tiepoint.y - image.getHeight() * yScale,
                    cellXSize: xScale,
                    cellYSize: yScale,
                    zs: zs
                };
                return new ScalarField(p);
            });

            //console.timeEnd('ScalarField from GeoTIFF');
            return scalarFields;
        }
    }]);

    function ScalarField(params) {
        _classCallCheck(this, ScalarField);

        var _this = _possibleConstructorReturn(this, (ScalarField.__proto__ || Object.getPrototypeOf(ScalarField)).call(this, params));

        _this.zs = params['zs'];

        _this.grid = _this._buildGrid();
        _this._updateRange();
        //console.log(`ScalarField created (${this.nCols} x ${this.nRows})`);
        return _this;
    }

    /**
     * Builds a grid with a Number at each point, from an array
     * 'zs' following x-ascending & y-descending order
     * (same as in ASCIIGrid)
     * @private
     * @returns {Array.<Array.<Number>>} - grid[row][column]--> Number
     */


    _createClass(ScalarField, [{
        key: '_buildGrid',
        value: function _buildGrid() {
            var grid = this._arrayTo2d(this.zs, this.nRows, this.nCols);
            return grid;
        }
    }, {
        key: '_arrayTo2d',
        value: function _arrayTo2d(array, nRows, nCols) {
            var grid = [];
            var p = 0;
            for (var j = 0; j < nRows; j++) {
                var row = [];
                for (var i = 0; i < nCols; i++, p++) {
                    var z = array[p];
                    row[i] = this._isValid(z) ? z : null; // <<<
                }
                grid[j] = row;
            }
            return grid;
        }
    }, {
        key: '_newDataArrays',
        value: function _newDataArrays(params) {
            params['zs'] = [];
        }
    }, {
        key: '_pushValueToArrays',
        value: function _pushValueToArrays(params, value) {
            params['zs'].push(value);
        }
    }, {
        key: '_makeNewFrom',
        value: function _makeNewFrom(params) {
            return new ScalarField(params);
        }

        /**
         * Calculate min & max values
         * @private
         * @returns {Array} - [min, max]
         */

    }, {
        key: '_calculateRange',
        value: function _calculateRange() {
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

    }, {
        key: '_doInterpolation',
        value: function _doInterpolation(x, y, g00, g10, g01, g11) {
            var rx = 1 - x;
            var ry = 1 - y;
            return g00 * rx * ry + g10 * x * ry + g01 * rx * y + g11 * x * y;
        }
    }]);

    return ScalarField;
}(__WEBPACK_IMPORTED_MODULE_0__Field__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ScalarField);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  2D Vector
 */
var Vector = function () {
    function Vector(u, v) {
        _classCallCheck(this, Vector);

        this.u = u;
        this.v = v;
    }

    /**
     * Magnitude
     * @returns {Number}
     */


    _createClass(Vector, [{
        key: "magnitude",
        value: function magnitude() {
            return Math.sqrt(this.u * this.u + this.v * this.v);
        }

        /**
         * Angle in degrees (0 to 360º) --> Towards
         * N is 0º and E is 90º
         * @returns {Number}
         */

    }, {
        key: "directionTo",
        value: function directionTo() {
            var verticalAngle = Math.atan2(this.u, this.v);
            var inDegrees = verticalAngle * (180.0 / Math.PI);
            if (inDegrees < 0) {
                inDegrees = inDegrees + 360.0;
            }
            return inDegrees;
        }

        /**
         * Angle in degrees (0 to 360º) From x-->
         * N is 0º and E is 90º
         * @returns {Number}
         */

    }, {
        key: "directionFrom",
        value: function directionFrom() {
            var a = this.directionTo();
            var opposite = (a + 180.0) % 360.0;
            return opposite;
        }

        /*
            Degrees --> text
            new Dictionary<int, string>
            {
                //{0, 23, 45, 68, 90, 113, 135, 158, 180, 203, 225, 248, 270, 293, 315, 338, 360};
                {0, 'N'},
                {23, 'NNE'},
                {45, 'NE'},
                {68, 'ENE'},
                {90, 'E'},
                {113, 'ESE'},
                {135, 'SE'},
                {158, 'SSE'},
                {180, 'S'},
                {203, 'SSW'},
                {225, 'SW'},
                {248, 'WSW'},
                {270, 'W'},
                {293, 'WNW'},
                {315, 'NW'},
                {338, 'NNW'},
                {360, 'N'}
            };
        */

    }]);

    return Vector;
}();

/* harmony default export */ __webpack_exports__["a"] = (Vector);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Vector__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Field__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ScalarField__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





/**
 *  A set of vectors assigned to a regular 2D-grid (lon-lat)
 *  (e.g. a raster representing winds for a region)
 */

var VectorField = function (_Field) {
    _inherits(VectorField, _Field);

    _createClass(VectorField, null, [{
        key: 'fromASCIIGrids',

        /**
         * Creates a VectorField from the content of two ASCIIGrid files
         * @param   {String} ascU - with u-component
         * @param   {String} ascV - with v-component
         * @returns {VectorField}
         */
        value: function fromASCIIGrids(ascU, ascV) {
            var scaleFactor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            var u = __WEBPACK_IMPORTED_MODULE_2__ScalarField__["a" /* default */].fromASCIIGrid(ascU, scaleFactor);
            var v = __WEBPACK_IMPORTED_MODULE_2__ScalarField__["a" /* default */].fromASCIIGrid(ascV, scaleFactor);
            var p = VectorField._paramsFromScalarFields(u, v);

            return new VectorField(p);
        }

        /**
         * Creates a VectorField from the content of two different Geotiff files
         * @param   {ArrayBuffer} gtU - geotiff data with u-component (band 0)
         * @param   {ArrayBuffer} gtV - geotiff data with v-component (band 0)
         * @returns {VectorField}
         */

    }, {
        key: 'fromGeoTIFFs',
        value: function fromGeoTIFFs(gtU, gtV) {
            var u = __WEBPACK_IMPORTED_MODULE_2__ScalarField__["a" /* default */].fromGeoTIFF(gtU);
            var v = __WEBPACK_IMPORTED_MODULE_2__ScalarField__["a" /* default */].fromGeoTIFF(gtV);
            var p = VectorField._paramsFromScalarFields(u, v);

            return new VectorField(p);
        }

        /**
         * Creates a VectorField from the content of Multiband Geotiff
         * @param   {ArrayBuffer} geotiffData - multiband
         * @param   {Array} bandIndexesForUV
         * @returns {VectorField}
         */

    }, {
        key: 'fromMultibandGeoTIFF',
        value: function fromMultibandGeoTIFF(geotiffData) {
            var bandIndexesForUV = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 1];

            var u = __WEBPACK_IMPORTED_MODULE_2__ScalarField__["a" /* default */].fromGeoTIFF(geotiffData, bandIndexesForUV[0]);
            var v = __WEBPACK_IMPORTED_MODULE_2__ScalarField__["a" /* default */].fromGeoTIFF(geotiffData, bandIndexesForUV[1]);
            var p = VectorField._paramsFromScalarFields(u, v);

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

    }, {
        key: '_paramsFromScalarFields',
        value: function _paramsFromScalarFields(u, v) {
            // TODO check u & v compatibility (cellSize...)
            var p = {
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
    }]);

    function VectorField(params) {
        _classCallCheck(this, VectorField);

        var _this = _possibleConstructorReturn(this, (VectorField.__proto__ || Object.getPrototypeOf(VectorField)).call(this, params));

        _this.us = params['us'];
        _this.vs = params['vs'];
        _this.grid = _this._buildGrid();
        _this.range = _this._calculateRange();
        return _this;
    }

    /**
     * Get a derived field, from a computation on 
     * the VectorField
     * @param   {String} type ['magnitude' | 'directionTo' | 'directionFrom']
     * @returns {ScalarField}
     */


    _createClass(VectorField, [{
        key: 'getScalarField',
        value: function getScalarField(type) {
            var f = this._getFunctionFor(type);
            var p = {
                nCols: this.params.nCols,
                nRows: this.params.nRows,
                xllCorner: this.params.xllCorner,
                yllCorner: this.params.yllCorner,
                cellXSize: this.params.cellXSize,
                cellYSize: this.params.cellYSize,
                zs: this._applyOnField(f)
            };
            return new __WEBPACK_IMPORTED_MODULE_2__ScalarField__["a" /* default */](p);
        }
    }, {
        key: '_getFunctionFor',
        value: function _getFunctionFor(type) {
            return function (u, v) {
                var uv = new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](u, v);
                return uv[type](); // magnitude, directionTo, directionFrom
            };
        }
    }, {
        key: '_applyOnField',
        value: function _applyOnField(func) {
            var zs = [];
            var n = this.numCells();
            for (var i = 0; i < n; i++) {
                var u = this.us[i];
                var v = this.vs[i];
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

    }, {
        key: '_buildGrid',
        value: function _buildGrid() {
            var grid = this._arraysTo2d(this.us, this.vs, this.nRows, this.nCols);
            return grid;
        }
    }, {
        key: '_arraysTo2d',
        value: function _arraysTo2d(us, vs, nRows, nCols) {
            var grid = [];
            var p = 0;

            for (var j = 0; j < nRows; j++) {
                var row = [];
                for (var i = 0; i < nCols; i++, p++) {
                    var u = us[p],
                        v = vs[p];
                    var valid = this._isValid(u) && this._isValid(v);
                    row[i] = valid ? new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](u, v) : null; // <<<
                }
                grid[j] = row;
            }
            return grid;
        }
    }, {
        key: '_newDataArrays',
        value: function _newDataArrays(params) {
            params['us'] = [];
            params['vs'] = [];
        }
    }, {
        key: '_pushValueToArrays',
        value: function _pushValueToArrays(params, value) {
            //console.log(value);
            params['us'].push(value.u);
            params['vs'].push(value.v);
        }
    }, {
        key: '_makeNewFrom',
        value: function _makeNewFrom(params) {
            return new VectorField(params);
        }

        /**
         * Calculate min & max values (magnitude)
         * @private
         * @returns {Array}
         */

    }, {
        key: '_calculateRange',
        value: function _calculateRange() {
            // TODO make a clearer method for getting these vectors...
            var vectors = this.getCells().map(function (pt) {
                return pt.value;
            }).filter(function (v) {
                return v !== null;
            });

            if (this._inFilter) {
                vectors = vectors.filter(this._inFilter);
            }

            // TODO check memory crash with high num of vectors!
            var magnitudes = vectors.map(function (v) {
                return v.magnitude();
            });
            var min = d3.min(magnitudes);
            var max = d3.max(magnitudes);

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

    }, {
        key: '_doInterpolation',
        value: function _doInterpolation(x, y, g00, g10, g01, g11) {
            var rx = 1 - x;
            var ry = 1 - y;
            var a = rx * ry,
                b = x * ry,
                c = rx * y,
                d = x * y;
            var u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
            var v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
            return new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](u, v);
        }

        /**
         * Is valid (not 'null' nor 'undefined')
         * @private
         * @param   {Object} x object
         * @returns {Boolean}
         */

    }, {
        key: '_isValid',
        value: function _isValid(x) {
            return x !== null && x !== undefined;
        }
    }]);

    return VectorField;
}(__WEBPACK_IMPORTED_MODULE_1__Field__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (VectorField);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 *   Control for a simple legend with a colorbar
 *   References:
 *      - http://jsfiddle.net/ramnathv/g8stqcf6/
 *      - http://jsfiddle.net/vis4/cYLZH/
 */
L.Control.ColorBar = L.Control.extend({
    options: {
        position: 'bottomleft',
        width: 300, // for colorbar itself (control is wider)
        height: 15,
        margin: 15,
        background: '#fff',
        textColor: 'black',
        steps: 100,
        decimals: 2,
        units: 'uds', // ej: m/s
        title: 'Legend', // ej: Ocean Currents
        labels: [], // empty for no labels
        labelFontSize: 10,
        labelTextPosition: 'middle' // start | middle | end
    },

    initialize: function initialize(color, range, options) {
        this.color = color; // 'chromajs' scale function
        this.range = range; // [min, max]
        L.Util.setOptions(this, options);
    },

    onAdd: function onAdd(map) {
        this._map = map;
        var div = L.DomUtil.create('div', 'leaflet-control-colorBar leaflet-bar leaflet-control');
        div.style.padding = '10px';

        L.DomEvent.addListener(div, 'click', L.DomEvent.stopPropagation).addListener(div, 'click', L.DomEvent.preventDefault);
        div.style.backgroundColor = this.options.background;
        div.style.cursor = 'text';
        div.innerHTML = this.title() + this.palette();
        return div;
    },

    title: function title() {
        var d = document.createElement('div');
        d3.select(d).append('span').style('color', this.options.textColor).style('display', 'block').style('margin-bottom', '5px').attr('class', 'leaflet-control-colorBar-title').text(this.options.title);
        return d.innerHTML;
    },

    palette: function palette() {
        var d = document.createElement('div');
        var svg = this._createSvgIn(d);

        this._appendColorBarTo(svg);

        if (this.options.labels) {
            this._appendLabelsTo(svg);
        }

        return d.innerHTML;
    },

    _createSvgIn: function _createSvgIn(d) {
        var spaceForLabels = this.options.labels ? this.options.margin : 0;
        var svg = d3.select(d).append('svg').attr('width', this.options.width + this.options.margin * 2).attr('height', this.options.height + spaceForLabels);
        return svg;
    },

    _appendColorBarTo: function _appendColorBarTo(svg) {
        var _this = this;

        var colorPerValue = this._getColorPerValue();
        var w = this.options.width / colorPerValue.length;

        var groupBars = svg.append('g').attr('id', 'colorBar-buckets');
        var buckets = groupBars.selectAll('rect').data(colorPerValue).enter().append('rect');
        buckets.attr('x', function (d, i) {
            return i * w + _this.options.margin;
        }).attr('y', function () {
            return 0;
        }).attr('height', function () {
            return _this.options.height;
        } /*w * 4*/).attr('width', function () {
            return w;
        }).attr('stroke-width', 2).attr('stroke-linecap', 'butt').attr('stroke', function (d) {
            return d.color.hex();
        }).attr('fill', function (d) {
            return d.color.hex();
        });
        buckets.append('title').text(function (d) {
            return d.value.toFixed(_this.options.decimals) + ' ' + _this.options.units;
        });
    },

    _appendLabelsTo: function _appendLabelsTo(svg) {
        var _this2 = this;

        var positionPerLabelValue = this._getPositionPerLabelValue();
        //const w = this.options.width / colorPerValue.length;
        var groupLabels = svg.append('g').attr('id', 'colorBar-labels');
        var labels = groupLabels.selectAll('text').data(positionPerLabelValue).enter().append('text');
        labels.attr('x', function (d) {
            return d.position + _this2.options.margin;
        }).attr('y', this.options.height + this.options.margin).attr('font-size', this.options.labelFontSize + 'px').attr('text-anchor', this.options.labelTextPosition).attr('fill', this.options.textColor).attr('class', 'leaflet-control-colorBar-label').text(function (d) {
            return '' + d.value.toFixed(_this2.options.decimals);
        });
    },

    _getColorPerValue: function _getColorPerValue() {
        var _this3 = this;

        var _range = _slicedToArray(this.range, 2),
            min = _range[0],
            max = _range[1];

        var delta = (max - min) / this.options.steps;
        var data = d3.range(min, max + delta, delta);
        var colorPerValue = data.map(function (d) {
            return {
                value: d,
                color: _this3.color(d)
            };
        });
        return colorPerValue;
    },

    _getPositionPerLabelValue: function _getPositionPerLabelValue() {
        var xPositionFor = d3.scaleLinear().range([0, this.options.width]).domain(this.range);
        var data = this.options.labels;
        var positionPerLabel = data.map(function (d) {
            return {
                value: d,
                position: xPositionFor(d)
            };
        });
        return positionPerLabel;
    }
});

L.control.colorBar = function (color, range, options) {
    return new L.Control.ColorBar(color, range, options);
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Abstract class for a Field layer on canvas, aka 'a Raster layer'
 * (ScalarField or a VectorField)
 */
L.CanvasLayer.Field = L.CanvasLayer.extend({
    options: {
        mouseMoveCursor: {
            value: 'pointer',
            noValue: 'default'
        },
        opacity: 1,
        onClick: null,
        onMouseMove: null,
        inFilter: null
    },

    initialize: function initialize(field, options) {
        L.Util.setOptions(this, options);
        this._visible = true;
        if (field) {
            this.setData(field);
        }
    },

    getEvents: function getEvents() {
        var events = L.CanvasLayer.prototype.getEvents.call(this);
        events.zoomstart = this._hideCanvas.bind(this);
        events.zoomend = this._showCanvas.bind(this);
        return events;
    },

    onLayerDidMount: function onLayerDidMount() {
        this._enableIdentify();
        this._ensureCanvasAlignment();
    },

    show: function show() {
        this._visible = true;
        this._showCanvas();
        this._enableIdentify();
    },
    hide: function hide() {
        this._visible = false;
        this._hideCanvas();
        this._disableIdentify();
    },
    isVisible: function isVisible() {
        return this._visible;
    },
    _showCanvas: function _showCanvas() {
        if (this._canvas && this._visible) {
            this._canvas.style.visibility = 'visible';
        }
    },
    _hideCanvas: function _hideCanvas() {
        if (this._canvas) {
            this._canvas.style.visibility = 'hidden';
        }
    },
    _enableIdentify: function _enableIdentify() {
        this._map.on('click', this._onClick, this);
        this._map.on('mousemove', this._onMouseMove, this);

        this.options.onClick && this.on('click', this.options.onClick, this);
        this.options.onMouseMove && this.on('mousemove', this.options.onMouseMove, this);
    },
    _disableIdentify: function _disableIdentify() {
        this._map.off('click', this._onClick, this);
        this._map.off('mousemove', this._onMouseMove, this);

        this.options.onClick && this.off('click', this.options.onClick, this);
        this.options.onMouseMove && this.off('mousemove', this.options.onMouseMove, this);
    },
    _ensureCanvasAlignment: function _ensureCanvasAlignment() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
    },


    onLayerWillUnmount: function onLayerWillUnmount() {
        this._disableIdentify();
    },

    needRedraw: function needRedraw() {
        if (this._map && this._field) {
            L.CanvasLayer.prototype.needRedraw.call(this);
        }
    },


    /* eslint-disable no-unused-vars */
    onDrawLayer: function onDrawLayer(viewInfo) {
        throw new TypeError('Must be overriden');
    },
    /* eslint-enable no-unused-vars */

    setData: function setData(field) {
        this.options.inFilter && field.setFilter(this.options.inFilter);
        this._field = field;
        this.needRedraw();
        this.fire('load');
    },

    setFilter: function setFilter(f) {
        this.options.inFilter = f;
        this._field && this._field.setFilter(f);
        this.needRedraw();
    },

    setOpacity: function setOpacity(opacity) {
        this.options.opacity = opacity;

        if (this._canvas) {
            this._updateOpacity();
        }
        return this;
    },

    getBounds: function getBounds() {
        var bb = this._field.extent();

        var southWest = L.latLng(bb[1], bb[0]),
            northEast = L.latLng(bb[3], bb[2]);
        var bounds = L.latLngBounds(southWest, northEast);
        return bounds;
    },

    _onClick: function _onClick(e) {
        var v = this._queryValue(e);
        this.fire('click', v);
    },

    _onMouseMove: function _onMouseMove(e) {
        var v = this._queryValue(e);
        this._changeCursorOn(v);
        this.fire('mousemove', v);
    },

    _changeCursorOn: function _changeCursorOn(v) {
        if (!this.options.mouseMoveCursor) return;

        var _options$mouseMoveCur = this.options.mouseMoveCursor,
            value = _options$mouseMoveCur.value,
            noValue = _options$mouseMoveCur.noValue;

        var style = this._map.getContainer().style;
        style.cursor = v.value !== null ? value : noValue;
    },

    _updateOpacity: function _updateOpacity() {
        L.DomUtil.setOpacity(this._canvas, this.options.opacity);
    },

    _queryValue: function _queryValue(e) {
        var v = this._field ? this._field.valueAt(e.latlng.lng, e.latlng.lat) : null;
        var result = {
            latlng: e.latlng,
            value: v
        };
        return result;
    },

    _getDrawingContext: function _getDrawingContext() {
        var g = this._canvas.getContext('2d');
        g.clearRect(0, 0, this._canvas.width, this._canvas.height);
        return g;
    }
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Cell__ = __webpack_require__(0);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();



/**
 * ScalarField on canvas (a 'Raster')
 */
L.CanvasLayer.ScalarField = L.CanvasLayer.Field.extend({
    options: {
        type: 'colormap', // [colormap|vector]
        color: null, // function colorFor(value) [e.g. chromajs.scale],
        interpolate: false, // Change to use interpolation
        vectorSize: 20, // only used if 'vector'
        arrowDirection: 'from' // [from|towards]
    },

    initialize: function initialize(scalarField, options) {
        L.CanvasLayer.Field.prototype.initialize.call(this, scalarField, options);
        L.Util.setOptions(this, options);
    },

    _defaultColorScale: function _defaultColorScale() {
        return chroma.scale(['white', 'black']).domain(this._field.range);
    },

    setColor: function setColor(f) {
        this.options.color = f;
        this.needRedraw();
    },


    /* eslint-disable no-unused-vars */
    onDrawLayer: function onDrawLayer(viewInfo) {
        if (!this.isVisible()) return;
        this._updateOpacity();

        var r = this._getRendererMethod();
        //console.time('onDrawLayer');
        r();
        //console.timeEnd('onDrawLayer');
    },
    /* eslint-enable no-unused-vars */

    _getRendererMethod: function _getRendererMethod() {
        switch (this.options.type) {
            case 'colormap':
                return this._drawImage.bind(this);
            case 'vector':
                return this._drawArrows.bind(this);
            default:
                throw Error('Unkwown renderer type: ' + this.options.type);
        }
    },

    _ensureColor: function _ensureColor() {
        if (this.options.color === null) {
            this.setColor(this._defaultColorScale());
        }
    },

    _showCanvas: function _showCanvas() {
        L.CanvasLayer.Field.prototype._showCanvas.call(this);
        this.needRedraw(); // TODO check spurious redraw (e.g. hide/show without moving map)
    },


    /**
     * Draws the field in an ImageData and applying it with putImageData.
     * Used as a reference: http://geoexamples.com/d3-raster-tools-docs/code_samples/raster-pixels-page.html
     */
    _drawImage: function _drawImage() {
        this._ensureColor();

        var ctx = this._getDrawingContext();
        var width = this._canvas.width;
        var height = this._canvas.height;

        var img = ctx.createImageData(width, height);
        var data = img.data;

        this._prepareImageIn(data, width, height);
        ctx.putImageData(img, 0, 0);
    },

    /**
     * Prepares the image in data, as array with RGBAs
     * [R1, G1, B1, A1, R2, G2, B2, A2...]
     * @private
     * @param {[[Type]]} data   [[Description]]
     * @param {Numver} width
     * @param {Number} height
     */
    _prepareImageIn: function _prepareImageIn(data, width, height) {
        var f = this.options.interpolate ? 'interpolatedValueAt' : 'valueAt';

        var pos = 0;
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var pointCoords = this._map.containerPointToLatLng([i, j]);
                var lon = pointCoords.lng;
                var lat = pointCoords.lat;

                var v = this._field[f](lon, lat); // 'valueAt' | 'interpolatedValueAt' || TODO check some 'artifacts'
                if (v !== null) {
                    var color = this._getColorFor(v);

                    var _color$rgba = color.rgba(),
                        _color$rgba2 = _slicedToArray(_color$rgba, 4),
                        R = _color$rgba2[0],
                        G = _color$rgba2[1],
                        B = _color$rgba2[2],
                        A = _color$rgba2[3];

                    data[pos] = R;
                    data[pos + 1] = G;
                    data[pos + 2] = B;
                    data[pos + 3] = parseInt(A * 255); // not percent in alpha but hex 0-255
                }
                pos = pos + 4;
            }
        }
    },


    /**
     * Draws the field as a set of arrows. Direction from 0 to 360 is assumed.
     */
    _drawArrows: function _drawArrows() {
        var bounds = this._pixelBounds();
        var pixelSize = (bounds.max.x - bounds.min.x) / this._field.nCols;

        var stride = Math.max(1, Math.floor(1.2 * this.options.vectorSize / pixelSize));

        var ctx = this._getDrawingContext();
        ctx.strokeStyle = this.options.color;

        var currentBounds = this._map.getBounds();

        for (var y = 0; y < this._field.height; y = y + stride) {
            for (var x = 0; x < this._field.width; x = x + stride) {
                var _field$_lonLatAtIndex = this._field._lonLatAtIndexes(x, y),
                    _field$_lonLatAtIndex2 = _slicedToArray(_field$_lonLatAtIndex, 2),
                    lon = _field$_lonLatAtIndex2[0],
                    lat = _field$_lonLatAtIndex2[1];

                var v = this._field.valueAt(lon, lat);
                var center = L.latLng(lat, lon);
                if (v !== null && currentBounds.contains(center)) {
                    var cell = new __WEBPACK_IMPORTED_MODULE_0__Cell__["a" /* default */](center, v, this.cellXSize, this.cellYSize);
                    this._drawArrow(cell, ctx);
                }
            }
        }
    },

    _pixelBounds: function _pixelBounds() {
        var bounds = this.getBounds();
        var northWest = this._map.latLngToContainerPoint(bounds.getNorthWest());
        var southEast = this._map.latLngToContainerPoint(bounds.getSouthEast());
        var pixelBounds = L.bounds(northWest, southEast);
        return pixelBounds;
    },

    _drawArrow: function _drawArrow(cell, ctx) {
        var projected = this._map.latLngToContainerPoint(cell.center);

        // colormap vs. simple color
        var color = this.options.color;
        if (typeof color === 'function') {
            ctx.strokeStyle = color(cell.value);
        }

        var size = this.options.vectorSize;
        ctx.save();

        ctx.translate(projected.x, projected.y);

        var rotationRads = (90 + cell.value) * Math.PI / 180; // from, by default
        if (this.options.arrowDirection === 'towards') {
            rotationRads = rotationRads + Math.PI;
        }
        ctx.rotate(rotationRads);

        ctx.beginPath();
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(+size / 2, 0);
        ctx.moveTo(size * 0.25, -size * 0.25);
        ctx.lineTo(+size / 2, 0);
        ctx.lineTo(size * 0.25, size * 0.25);
        ctx.stroke();
        ctx.restore();
    },

    /**
     * Gets a chroma color for a pixel value, according to 'options.color'
     */
    _getColorFor: function _getColorFor(v) {
        var c = this.options.color; // e.g. for a constant 'red'
        if (typeof c === 'function') {
            c = this.options.color(v);
        }
        var color = chroma(c); // to be more flexible, a chroma color object is always created || TODO improve efficiency
        return color;
    }
});

L.canvasLayer.scalarField = function (scalarField, options) {
    return new L.CanvasLayer.ScalarField(scalarField, options);
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 *  Simple layer with lon-lat points
 *
 *  TODO rename to SimplePoint?
 */
L.CanvasLayer.SimpleLonLat = L.CanvasLayer.extend({
    options: {
        color: 'gray'
    },

    initialize: function initialize(points, options) {
        this.points = points;
        L.Util.setOptions(this, options);
    },

    onLayerDidMount: function onLayerDidMount() {
        // -- prepare custom drawing
    },

    onLayerWillUnmount: function onLayerWillUnmount() {
        // -- custom cleanup
    },

    /* eslint-disable no-unused-vars */
    setData: function setData(data) {
        // -- custom data set
        this.needRedraw(); // -- call to drawLayer
    },
    /* eslint-enable no-unused-vars */

    onDrawLayer: function onDrawLayer(viewInfo) {
        // canvas preparation
        var g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
        g.fillStyle = this.options.color;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var point = _step.value;

                var p = viewInfo.layer._map.latLngToContainerPoint(point);
                g.beginPath();
                //g.arc(p.x, p.y, 1, 0, Math.PI * 2); // circle | TODO style 'function' as parameter?
                g.fillRect(p.x, p.y, 2, 2); //simple point
                g.fill();
                g.closePath();
                g.stroke();
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },

    getBounds: function getBounds() {
        // TODO: bounding with points...
        var xs = this.points.map(function (pt) {
            return pt.lng;
        });
        var ys = this.points.map(function (pt) {
            return pt.lat;
        });

        var xmin = Math.min.apply(Math, _toConsumableArray(xs));
        var ymin = Math.min.apply(Math, _toConsumableArray(ys));
        var xmax = Math.max.apply(Math, _toConsumableArray(xs));
        var ymax = Math.max.apply(Math, _toConsumableArray(ys));

        var southWest = L.latLng(ymin, xmin),
            northEast = L.latLng(ymax, xmax);
        var bounds = L.latLngBounds(southWest, northEast); // TODO FIX ERROR ? half-pixel?
        return bounds;
    }
});

L.canvasLayer.simpleLonLat = function (lonslats, options) {
    return new L.CanvasLayer.SimpleLonLat(lonslats, options);
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * Animated VectorField on canvas
 */
L.CanvasLayer.VectorFieldAnim = L.CanvasLayer.Field.extend({
    options: {
        paths: 800,
        color: 'white', // html-color | function colorFor(value) [e.g. chromajs.scale]
        width: 1.0, // number | function widthFor(value)
        fade: 0.96, // 0 to 1
        duration: 20, // milliseconds per 'frame'
        maxAge: 200, // number of maximum frames per path
        velocityScale: 1 / 5000
    },

    initialize: function initialize(vectorField, options) {
        L.CanvasLayer.Field.prototype.initialize.call(this, vectorField, options);
        L.Util.setOptions(this, options);

        this.timer = null;
    },

    onLayerDidMount: function onLayerDidMount() {
        L.CanvasLayer.Field.prototype.onLayerDidMount.call(this);
        this._map.on('move resize', this._stopAnimation, this);
    },

    onLayerWillUnmount: function onLayerWillUnmount() {
        L.CanvasLayer.Field.prototype.onLayerWillUnmount.call(this);
        this._map.off('move resize', this._stopAnimation, this);
        this._stopAnimation();
    },

    _hideCanvas: function _showCanvas() {
        L.CanvasLayer.Field.prototype._hideCanvas.call(this);
        this._stopAnimation();
    },

    onDrawLayer: function onDrawLayer(viewInfo) {
        if (!this._field || !this.isVisible()) return;

        this._updateOpacity();

        var ctx = this._getDrawingContext();
        var paths = this._prepareParticlePaths();

        this.timer = d3.timer(function () {
            _moveParticles();
            _drawParticles();
        }, this.options.duration);

        var self = this;

        /**
         * Builds the paths, adding 'particles' on each animation step, considering
         * their properties (age / position source > target)
         */
        function _moveParticles() {
            // let screenFactor = 1 / self._map.getZoom(); // consider using a 'screenFactor' to ponderate velocityScale
            paths.forEach(function (par) {
                if (par.age > self.options.maxAge) {
                    // restart, on a random x,y
                    par.age = 0;
                    self._field.randomPosition(par);
                }

                var vector = self._field.valueAt(par.x, par.y);
                if (vector === null) {
                    par.age = self.options.maxAge;
                } else {
                    // the next point will be...
                    var xt = par.x + vector.u * self.options.velocityScale; //* screenFactor;
                    var yt = par.y + vector.v * self.options.velocityScale; //* screenFactor;

                    if (self._field.hasValueAt(xt, yt)) {
                        par.xt = xt;
                        par.yt = yt;
                        par.m = vector.magnitude();
                    } else {
                        // not visible anymore...
                        par.age = self.options.maxAge;
                    }
                }
                par.age += 1;
            });
        }

        /**
         * Draws the paths on each step
         */
        function _drawParticles() {
            // Previous paths...
            var prev = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = 'destination-in';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            //ctx.globalCompositeOperation = 'source-over';
            ctx.globalCompositeOperation = prev;

            // fading paths...
            ctx.fillStyle = 'rgba(0, 0, 0, ' + self.options.fade + ')';
            ctx.lineWidth = self.options.width;
            ctx.strokeStyle = self.options.color;

            // New paths
            paths.forEach(function (par) {
                self._drawParticle(viewInfo, ctx, par);
            });
        }
    },

    _drawParticle: function _drawParticle(viewInfo, ctx, par) {
        var source = new L.latLng(par.y, par.x);
        var target = new L.latLng(par.yt, par.xt);

        if (viewInfo.bounds.contains(source) && par.age <= this.options.maxAge) {
            var pA = viewInfo.layer._map.latLngToContainerPoint(source);
            var pB = viewInfo.layer._map.latLngToContainerPoint(target);

            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);

            // next-step movement
            par.x = par.xt;
            par.y = par.yt;

            // colormap vs. simple color
            var color = this.options.color;
            if (typeof color === 'function') {
                ctx.strokeStyle = color(par.m);
            }

            var width = this.options.width;
            if (typeof width === 'function') {
                ctx.lineWidth = width(par.m);
            }

            ctx.stroke();
        }
    },


    _prepareParticlePaths: function _prepareParticlePaths() {
        var paths = [];

        for (var i = 0; i < this.options.paths; i++) {
            var p = this._field.randomPosition();
            p.age = this._randomAge();
            paths.push(p);
        }
        return paths;
    },

    _randomAge: function _randomAge() {
        return Math.floor(Math.random() * this.options.maxAge);
    },

    _stopAnimation: function _stopAnimation() {
        if (this.timer) {
            this.timer.stop();
        }
    }
});

L.canvasLayer.vectorFieldAnim = function (vectorField, options) {
    return new L.CanvasLayer.VectorFieldAnim(vectorField, options);
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

/*
  1.0.1 (downloaded from https://github.com/Sumbera/gLayers.Leaflet/releases/tag/v1.0.1)

  Generic  Canvas Layer for leaflet 0.7 and 1.0-rc,
  copyright Stanislav Sumbera,  2016 , sumbera.com , license MIT
  originally created and motivated by L.CanvasOverlay  available here: https://gist.github.com/Sumbera/11114288
*/

L.CanvasLayer = L.Layer.extend({
    // -- initialized is called on prototype
    initialize: function initialize(options) {
        this._map = null;
        this._canvas = null;
        this._frame = null;
        this._delegate = null;
        L.setOptions(this, options);
    },

    delegate: function delegate(del) {
        this._delegate = del;
        return this;
    },

    needRedraw: function needRedraw() {
        if (!this._frame) {
            this._frame = L.Util.requestAnimFrame(this.drawLayer, this);
        }
        return this;
    },

    //-------------------------------------------------------------
    _onLayerDidResize: function _onLayerDidResize(resizeEvent) {
        this._canvas.width = resizeEvent.newSize.x;
        this._canvas.height = resizeEvent.newSize.y;
    },
    //-------------------------------------------------------------
    _onLayerDidMove: function _onLayerDidMove() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this.drawLayer();
    },
    //-------------------------------------------------------------
    getEvents: function getEvents() {
        var events = {
            resize: this._onLayerDidResize,
            moveend: this._onLayerDidMove
        };
        if (this._map.options.zoomAnimation && L.Browser.any3d) {
            events.zoomanim = this._animateZoom;
        }

        return events;
    },
    //-------------------------------------------------------------
    onAdd: function onAdd(map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
        this.tiles = {};

        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

        map._panes.overlayPane.appendChild(this._canvas);

        map.on(this.getEvents(), this);

        var del = this._delegate || this;
        del.onLayerDidMount && del.onLayerDidMount(); // -- callback

        this.needRedraw();
    },

    //-------------------------------------------------------------
    onRemove: function onRemove(map) {
        var del = this._delegate || this;
        del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback


        map.getPanes().overlayPane.removeChild(this._canvas);

        map.off(this.getEvents(), this);

        this._canvas = null;
    },

    //------------------------------------------------------------
    addTo: function addTo(map) {
        map.addLayer(this);
        return this;
    },
    // --------------------------------------------------------------------------------
    LatLonToMercator: function LatLonToMercator(latlon) {
        return {
            x: latlon.lng * 6378137 * Math.PI / 180,
            y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
        };
    },

    //------------------------------------------------------------------------------
    drawLayer: function drawLayer() {
        // -- todo make the viewInfo properties  flat objects.
        var size = this._map.getSize();
        var bounds = this._map.getBounds();
        var zoom = this._map.getZoom();

        var center = this.LatLonToMercator(this._map.getCenter());
        var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));

        var del = this._delegate || this;
        del.onDrawLayer && del.onDrawLayer({
            layer: this,
            canvas: this._canvas,
            bounds: bounds,
            size: size,
            zoom: zoom,
            center: center,
            corner: corner
        });
        this._frame = null;
    },

    //------------------------------------------------------------------------------
    _animateZoom: function _animateZoom(e) {
        var scale = this._map.getZoomScale(e.zoom);
        var offset = this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(), e.zoom, e.center);

        L.DomUtil.setTransform(this._canvas, offset, scale);
    }
});

L.canvasLayer = function () {
    return new L.CanvasLayer();
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var invariant = __webpack_require__(12);
var getCoord = invariant.getCoord;
var getCoords = invariant.getCoords;

// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point resides inside the polygon. The polygon can
 * be convex or concave. The function accounts for holes.
 *
 * @name inside
 * @param {Feature<Point>} point input point
 * @param {Feature<Polygon|MultiPolygon>} polygon input polygon or multipolygon
 * @param {boolean} [ignoreBoundary=false] True if polygon boundary should be ignored when determining if the point is inside the polygon otherwise false.
 * @returns {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = turf.point([-77, 44]);
 * var poly = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * turf.inside(pt, poly);
 * //= true
 */
module.exports = function (point, polygon, ignoreBoundary) {
    // validation
    if (!point) throw new Error('point is required');
    if (!polygon) throw new Error('polygon is required');

    var pt = getCoord(point);
    var polys = getCoords(polygon);
    var type = (polygon.geometry) ? polygon.geometry.type : polygon.type;
    var bbox = polygon.bbox;

    // Quick elimination if point is not inside bbox
    if (bbox && inBBox(pt, bbox) === false) return false;

    // normalize to multipolygon
    if (type === 'Polygon') polys = [polys];

    for (var i = 0, insidePoly = false; i < polys.length && !insidePoly; i++) {
        // check if it is in the outer ring first
        if (inRing(pt, polys[i][0], ignoreBoundary)) {
            var inHole = false;
            var k = 1;
            // check for the point in any of the holes
            while (k < polys[i].length && !inHole) {
                if (inRing(pt, polys[i][k], !ignoreBoundary)) {
                    inHole = true;
                }
                k++;
            }
            if (!inHole) insidePoly = true;
        }
    }
    return insidePoly;
};

/**
 * inRing
 *
 * @private
 * @param {[number, number]} pt [x,y]
 * @param {Array<[number, number]>} ring [[x,y], [x,y],..]
 * @param {boolean} ignoreBoundary ignoreBoundary
 * @returns {boolean} inRing
 */
function inRing(pt, ring, ignoreBoundary) {
    var isInside = false;
    if (ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) ring = ring.slice(0, ring.length - 1);

    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1];
        var xj = ring[j][0], yj = ring[j][1];
        var onBoundary = (pt[1] * (xi - xj) + yi * (xj - pt[0]) + yj * (pt[0] - xi) === 0) &&
            ((xi - pt[0]) * (xj - pt[0]) <= 0) && ((yi - pt[1]) * (yj - pt[1]) <= 0);
        if (onBoundary) return !ignoreBoundary;
        var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

/**
 * inBBox
 *
 * @private
 * @param {[number, number]} pt point [x,y]
 * @param {[number, number, number, number]} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
function inBBox(pt, bbox) {
    return bbox[0] <= pt[0] &&
           bbox[1] <= pt[1] &&
           bbox[2] >= pt[0] &&
           bbox[3] >= pt[1];
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @name getCoord
 * @param {Array<number>|Geometry<Point>|Feature<Point>} obj Object
 * @returns {Array<number>} coordinates
 * @example
 * var pt = turf.point([10, 10]);
 *
 * var coord = turf.getCoord(pt);
 * //= [10, 10]
 */
function getCoord(obj) {
    if (!obj) throw new Error('obj is required');

    var coordinates = getCoords(obj);

    // getCoord() must contain at least two numbers (Point)
    if (coordinates.length > 1 &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number') {
        return coordinates;
    } else {
        throw new Error('Coordinate is not a valid Point');
    }
}

/**
 * Unwrap coordinates from a Feature, Geometry Object or an Array of numbers
 *
 * @name getCoords
 * @param {Array<number>|Geometry|Feature} obj Object
 * @returns {Array<number>} coordinates
 * @example
 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
 *
 * var coord = turf.getCoords(poly);
 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
 */
function getCoords(obj) {
    if (!obj) throw new Error('obj is required');
    var coordinates;

    // Array of numbers
    if (obj.length) {
        coordinates = obj;

    // Geometry Object
    } else if (obj.coordinates) {
        coordinates = obj.coordinates;

    // Feature
    } else if (obj.geometry && obj.geometry.coordinates) {
        coordinates = obj.geometry.coordinates;
    }
    // Checks if coordinates contains a number
    if (coordinates) {
        containsNumber(coordinates);
        return coordinates;
    }
    throw new Error('No valid coordinates');
}

/**
 * Checks if coordinates contains a number
 *
 * @name containsNumber
 * @param {Array<any>} coordinates GeoJSON Coordinates
 * @returns {boolean} true if Array contains a number
 */
function containsNumber(coordinates) {
    if (coordinates.length > 1 &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number') {
        return true;
    }

    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
        return containsNumber(coordinates[0]);
    }
    throw new Error('coordinates must only contain numbers');
}

/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @name geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function geojsonType(value, type, name) {
    if (!type || !name) throw new Error('type and name required');

    if (!value || value.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + value.type);
    }
}

/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
function featureOf(feature, type, name) {
    if (!feature) throw new Error('No feature passed');
    if (!name) throw new Error('.featureOf() requires a name');
    if (!feature || feature.type !== 'Feature' || !feature.geometry) {
        throw new Error('Invalid input to ' + name + ', Feature with geometry required');
    }
    if (!feature.geometry || feature.geometry.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
    }
}

/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function collectionOf(featureCollection, type, name) {
    if (!featureCollection) throw new Error('No featureCollection passed');
    if (!name) throw new Error('.collectionOf() requires a name');
    if (!featureCollection || featureCollection.type !== 'FeatureCollection') {
        throw new Error('Invalid input to ' + name + ', FeatureCollection required');
    }
    for (var i = 0; i < featureCollection.features.length; i++) {
        var feature = featureCollection.features[i];
        if (!feature || feature.type !== 'Feature' || !feature.geometry) {
            throw new Error('Invalid input to ' + name + ', Feature with geometry required');
        }
        if (!feature.geometry || feature.geometry.type !== type) {
            throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
        }
    }
}

/**
 * Get Geometry from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {Geometry|null} GeoJSON Geometry Object
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeom(point)
 * //={"type": "Point", "coordinates": [110, 40]}
 */
function getGeom(geojson) {
    if (!geojson) throw new Error('geojson is required');
    if (geojson.geometry !== undefined) return geojson.geometry;
    if (geojson.coordinates || geojson.geometries) return geojson;
    throw new Error('geojson must be a valid Feature or Geometry Object');
}

/**
 * Get Geometry Type from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {string} GeoJSON Geometry Type
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeomType(point)
 * //="Point"
 */
function getGeomType(geojson) {
    if (!geojson) throw new Error('geojson is required');
    var geom = getGeom(geojson);
    if (geom) return geom.type;
}

module.exports = {
    geojsonType: geojsonType,
    collectionOf: collectionOf,
    featureOf: featureOf,
    getCoord: getCoord,
    getCoords: getCoords,
    containsNumber: containsNumber,
    getGeom: getGeom,
    getGeomType: getGeomType
};


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Vector_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Cell_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Field_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ScalarField_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__VectorField_js__ = __webpack_require__(4);
// base

window.L.Vector = __WEBPACK_IMPORTED_MODULE_0__Vector_js__["a" /* default */];


window.L.Cell = __WEBPACK_IMPORTED_MODULE_1__Cell_js__["a" /* default */];


window.L.Field = __WEBPACK_IMPORTED_MODULE_2__Field_js__["a" /* default */];


window.L.ScalarField = __WEBPACK_IMPORTED_MODULE_3__ScalarField_js__["a" /* default */];


window.L.VectorField = __WEBPACK_IMPORTED_MODULE_4__VectorField_js__["a" /* default */];

// layer
__webpack_require__(10);
__webpack_require__(8);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(9);

// control
__webpack_require__(5);

/* eslint-disable no-console */
console.log('leaflet.canvaslayer.field v1.4.1');
/* eslint-enable no-console */

/***/ })
/******/ ]);
//# sourceMappingURL=leaflet.canvaslayer.field.js.map