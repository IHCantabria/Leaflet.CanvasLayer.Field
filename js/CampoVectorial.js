/**
 *  Clase para el manejo de un 'Campo Vectorial', entendido como un conjunto de vectores
 *  (con su lista de valores U y V) en una malla regular.
 *
 *  Nota: El orden de los datos vectoriales es el del ASCIIGrid (left->right & top ->down)
 */
class CampoVectorial {
    constructor(params) {
        this.ncols = params["ncols"];
        this.nrows = params["nrows"];

        this.xllcorner = params["xllcorner"]; // esquina ll = lower-left
        this.yllcorner = params["yllcorner"];

        this.xurcorner = params["xllcorner"] + params["ncols"] * params["dx"]; // esquina ur = upper-right
        this.yurcorner = params["yllcorner"] + params["nrows"] * params["dy"];

        this.dx = params["dx"];
        this.dy = params["dy"];

        this.malla = this._crearMalla(params["us"], params["vs"]);
    }

    /**
     * Constructor desde .json
     * @param   {object}   d [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    static desdeJson(d) {
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

        let cv = new CampoVectorial(params);
        return cv;
    }

    /**
     * Filas x columnas
     * @returns {Integer} - número de celdas de la malla
     */
    numeroCeldas() {
        return this.nrows * this.ncols;
    }

    /**
     * Construcción de una lista con todos los puntos de la malla
     * Para cada posición se devuelve su [lon, lat, u, v]
     * @returns {Array} - lista de coordenadas
     */
    mallaLonLatUV() {
        let lonslats = [];
        let lon = this.xllcorner;
        let lat = this.yllcorner;
        for (var j = 0; j < this.nrows; j++) {
            for (var i = 0; i < this.ncols; i++) {
                let uv = this._vector(i, j);
                lonslats.push([lon, lat, uv[0], uv[1]]);
                lon += this.dx;
            }
            lat += this.dy;
            lon = this.xllcorner;
        }
        return lonslats;
    }

    /**
     * Encuadre de malla
     * @returns {Array} [xmin, ymin, xmax, ymax]
     */
    limites() {
        return [this.xllcorner, this.yllcorner, this.xurcorner, this.yurcorner];
    }

    /**
     * Determina si unas coordenadas están dentro de la malla (se asume rectangular)
     * @param   {Float} lon - longitud
     * @param   {Float} lat - latitud
     * @returns {Boolean}
     */
    contiene(lon, lat) {
        return (lon >= this.xllcorner &&
            lon <= this.xurcorner &&
            lat >= this.yllcorner &&
            lat <= this.yurcorner);
    }

    /**
     * Determina si unas coordenadas están fuera de la malla
     * @param   {Float} lon - longitud
     * @param   {Float} lat - latitud
     * @returns {Boolean}
     */
    noContiene(lon, lat) {
        return !this.contiene(lon, lat);
    }


    /**
     * Valores del vector (interpolados) en las coordenadas longitud-latitud
     * @param   {Number} lon - Longitud
     * @param   {Number} lat - Latitud
     * @returns {Array}   [u, v]
     */
    valorEn(lon, lat) {
        if (this.noContiene(lon, lat)) return null;
        return this._interpolar(lon, lat);
    }

    /**
     * Indica si el campo tiene valores en unas coordenadas lon-lat
     * @param   {Float} lon - longitud
     * @param   {Float} lat - latitud
     * @returns {Boolean} tiene valor
     */
    tieneValorEn(lon, lat) {
        return this.valorEn(lon, lat) !== null;
    }

    /**
     * Indica si el campo NO tiene valores en unas coordenadas lon-lat
     * @param   {Float} lon - longitud
     * @param   {Float} lat - latitud
     * @returns {Boolean} no tiene valor
     */
    noTieneValorEn(lon, lat) {
        return !this.tieneValorEn(lon, lat);
    }



    /**
     * Crea / modifica la posición de 'o', con un valor aleatorio
     * dentro de la malla
     */
    posicionAleatoria(o = {}) {
        let i = _.random(0, this.ncols - 1);
        let j = _.random(0, this.nrows - 1);
        o.x = this._longitudIndiceX(i);
        o.y = this._latitudIndiceY(j);
        return o;
    }

    /**
     * Determina el valor mínimo y máximo del campo
     */
    rangoMagnitud() {
        let vectores = this.mallaLonLatUV().map(pto => new Vector(pto[2], pto[3]));
        let magnitudes = vectores.map(v => v.longitud());
        let min = Math.min(...magnitudes);
        let max = Math.max(...magnitudes);

        return [min, max];
    }

    /**
     * Preparación de una Malla con los valores [u,v] en cada punto
     * Se asume orden x-ascending e y-descending en los componentes u - v (el mismo que en ASCIIGrid)
     * @private
     * @param   {Array} us - componentes-u
     * @param   {Array} vs - componentes-v
     * @returns {Array} Malla[j][i] con valores [u,v] - filas/columunas
     */
    _crearMalla(us, vs) {
        let grid = [];
        let p = 0;

        for (var j = 0; j < this.nrows; j++) {
            var row = [];
            for (var i = 0; i < this.ncols; i++, p++) {
                // Se asume x-ascending e y-descending
                let u = us[p],
                    v = vs[p];
                let valido = (this._esValido(u) && this._esValido(v));
                //row[i] = (valido) ? [u, v] : null;
                row[i] = (valido) ? [u, v] : [null, null];
            }
            grid[j] = row;
        }
        return grid;
    }

    /**
     * Devuelve los valores del vector en las posiciones de malla indicadas
     * @param   {Integer} i - indiceColumna
     * @param   {Integer} j - fila
     * @returns {Array} [u, v]
     */
    _vector(i, j) {
        return this.malla[j][i]; // <-- j,i !
    }

    /**
     * Devuelve las coordenadas del vector en índices indicados
     * @param   {Integer} i - indiceColumna entero
     * @param   {Integer} j - indiceFila entero
     * @returns {Array} [lon, lat]
     */
    lonLatEnIndices(i, j) {
        let lon = this._longitudIndiceX(i);
        let lat = this._latitudIndiceY(j);

        return [lon, lat];
    }

    /**
     * Longitud para un índice de la malla
     * @param   {Integer} i - índice columna
     * @returns {Float} longitud en centro de la celda
     */
    _longitudIndiceX(i) {
        let medioPixel = this.dx / 2.0;
        return this.xllcorner + medioPixel + (i * this.dx);
    }

    /**
     * Latitud para un índice de la malla
     * @param   {Integer} j - índice fila
     * @returns {Float} latitud en centro de la celda
     */
    _latitudIndiceY(j) {
        let medioPixel = this.dy / 2.0;
        return this.yurcorner - medioPixel - (j * this.dy);
    }



    /**
     * Obtiene el valor del vector [u, v], a partir de la interpolación
     * de los valores más próximos de la malla (las 4 celdas más cercanas)
     * @private
     * @param {Float} lon - longitud
     * @param {Float} lat - latitud
     *
     * Tomado de https://github.com/cambecc/earth > product.js
     */
    _interpolar(lon, lat) {
        //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
        //        fi  i   ci          four points "G" that enclose point (i, j). These points are at the four
        //         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
        //      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
        //    j ___|_ .   |           (1, 9) and (2, 9).
        //  =8.3   |      |
        //      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
        //         |      |           column, so the index ci can be used without taking a modulo.


        // índices (con decimales)
        let lon0 = this.xllcorner + (this.dx / 2.0);
        let i = (lon - lon0) / this.dx;

        let lat0 = this.yurcorner - (this.dy / 2.0);
        let j = (lat0 - lat) / this.dy;

        // índices enteros, para las 4 celdas que rodean el punto (i, j)...
        let fi = Math.floor(i);
        let ci = fi + 1;
        let fj = Math.floor(j);
        let cj = fj + 1;

        //console.log(fi, ci, fj, cj);

        // y sus valores (si los hay...)
        var row;

        if ((row = this.malla[fj])) { // fila arriba ^^
            var g00 = row[fi]; // << izquierda
            var g10 = row[ci]; // derecha >>
            if (this._esValido(g00) && this._esValido(g10) && (row = this.malla[cj])) { // fila abajo vv
                var g01 = row[fi]; // << izquierda
                var g11 = row[ci]; // derecha >>
                if (this._esValido(g01) && this._esValido(g11)) {
                    // encontrados los 4 puntos = se interpola el valor
                    //console.log(g00, g10, g01, g11);
                    return this._bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
                }
            }
        }
        // console.log("cannot interpolate: " + λ + "," + φ + ": " + fi + " " + ci + " " + fj + " " + cj);
        return null;
    }

    /**
     * Interpolación bilineal
     * https://es.wikipedia.org/wiki/Interpolaci%C3%B3n_bilineal
     * @param   {[[Type]]} x   [[Description]]
     * @param   {[[Type]]} y   [[Description]]
     * @param   {[[Type]]} g00 [[Description]]
     * @param   {[[Type]]} g10 [[Description]]
     * @param   {[[Type]]} g01 [[Description]]
     * @param   {[[Type]]} g11 [[Description]]
     * @returns {Array}    [[Description]]
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
     * Si tiene valor (ni 'null' ni 'undefined')
     * @private
     * @param   {Object} x objeto
     * @returns {Boolean} OK
     */
    _esValido(x) {
        return (x !== null) && (x !== undefined);
    }
}
