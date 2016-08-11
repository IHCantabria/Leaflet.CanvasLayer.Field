// orden de vectores, el del ASCIIGrid (left->right & top ->down)
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
     * Filas x columnas
     * @returns {Integer} - número de celdas de la malla
     */
    numeroCeldas() {
        return this.nrows * this.ncols;
        /* equivalente a...
        var nFilas = this.malla.length;
        var nColumnas = this.malla[0].length;
        return nFilas * nColumnas;
        */
    }

    /**
     * Preparación de una Malla(i,j) con los valores [u,v] en cada punto
     * Se asume orden x-ascending e y-descending en los componentes u y v (el mismo que en ASCIIGrid y otros)
     * @private
     * @param {Array} us - componentes-u
     * @param {Array} vs - componentes-v
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
                let valido = (this.esValido(u) && this.esValido(v));
                row[i] = (valido) ? [u, v] : null;
            }
            grid[j] = row;
        }
        return grid;
    }

    /**
     * Crea / modifica una posición, con un valor aleatorio
     * dentro de la malla
     */
    posicionAleatoria(o = {}) {
        let i = _.random(0, this.ncols - 1);
        let j = _.random(0, this.nrows - 1);
        o.x = this.longitudIndiceX(i);
        o.y = this.latitudIndiceY(j);
        return o;
    }

    /**
     * Longitud para un índice de la malla
     * @param   {Integer} i - índice columna
     * @returns {Float} longitud en centro de la celda
     */
    longitudIndiceX(i) {
        let medioPixel = this.dx / 2.0;
        return this.xllcorner + medioPixel + (i * this.dx);
    }

    /**
     * Latitud para un índice de la malla
     * @param   {Integer} j - índice fila
     * @returns {Float} latitud en centro de la celda
     */
    latitudIndiceY(j) {
        let medioPixel = this.dy / 2.0;
        return this.yurcorner - medioPixel - (j * this.dy);
    }

    /**
     * Determina si unas coordenadas están dentro de la malla
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

    noContiene(lon, lat) {
        return !this.contiene(lon, lat);
    }

    /**
     * Devuelve los valores del vector en las posiciones de malla indicadas
     * @param   {Integer} índice de vector
     * @returns {Array} [u, v]
     */
    vector(i, j) {
        return this.malla[i][j];
    }

    /**
     * Devuelve las coordenadas del vector en índices indicados
     * @param   {Integer} indiceColumna - índice entero
     * @param   {Integer} indiceFila - índice entero
     * @returns {Array} [lon, lat]
     */
    lonLatEnIndices(indiceColumna, indiceFila) {
        let lon = this.longitudIndiceX(indiceColumna);
        let lat = this.latitudIndiceY(indiceFila);

        return [lon, lat];
    }

    /**
     * Indica si el vector tiene valores en unas coordenadas lon-lat
     * @param   {Float} lon - longitud
     * @param   {Float} lat - latitud
     * @returns {Boolean} tiene valor
     */
    tieneValorEn(lon, lat) {
        return this.valorEn(lon, lat) !== null;
    }

    noTieneValorEn(lon, lat) {
        return !this.tieneValorEn(lon, lat);
    }


    /**
     * Si tiene valor (ni 'null' ni 'undefined')
     * @private
     * @param   {Object} x objeto
     * @returns {Boolean} OK
     */
    esValido(x) {
        return (x !== null) && (x !== undefined);
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

        console.log(fi, ci, fj, cj);

        // y sus valores (si los hay...)
        var row;

        if ((row = this.malla[fj])) { // fila arriba ^^
            var g00 = row[fi]; // << izquierda
            var g10 = row[ci]; // derecha >>
            if (this.esValido(g00) && this.esValido(g10) && (row = this.malla[cj])) { // fila abajo vv
                var g01 = row[fi]; // << izquierda
                var g11 = row[ci]; // derecha >>
                if (this.esValido(g01) && this.esValido(g11)) {
                    // encontrados los 4 puntos = se interpola el valor
                    console.log(g00, g10, g01, g11);
                    return this.bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
                }
            }
        }
        // console.log("cannot interpolate: " + λ + "," + φ + ": " + fi + " " + ci + " " + fj + " " + cj);
        return null;
    }

    bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
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
}
