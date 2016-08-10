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
     * Malla con los valores [u,v] en cada punto
     * Se asume orden x-ascending e y-descending (el mismo que en ASCIIGrid y otros)
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
                let u = us[i],
                    v = vs[i];
                let valido = (u !== null && u !== undefined && v !== null & v !== undefined);
                row[i] = (valido) ? [u, v] : null;;
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
        let indiceX = _.random(0, this.ncols - 1);
        let indiceY = _.random(0, this.nrows - 1);

        var lon = this.xllcorner + (indiceX * this.dx);
        var lat = this.yllcorner + (indiceY * this.dy);;

        o.x = lon;
        o.y = lat;
        return o;
    }

    /**
     * Determina si unas coordenadas están dentro de la malla
     * @param   {Float} lon - longitud
     * @param   {Float} lat - latitud
     * @returns {Boolean}
     */
    dentroDeEncuadre(lon, lat) {
        return (lon >= this.xllcorner &&
            lon <= this.xurcorner &&
            lat >= this.yllcorner &&
            lat <= this.yurcorner);
    }

    // ----------------------




    /**
     * Devuelve el 'n' vector
     * @param   {Integer} índice de vector
     * @returns {Array} [u, v]
     */
    vector(i) {
        //let ir = Math.round(i); // TODO. revisar precisión...
        let u = this.us[i],
            v = this.vs[i];
        let valido = (u !== null && u !== undefined && v !== null & v !== undefined);
        return valido ? [u, v] : null;
    }


    /**
     * Devuelve las coordenadas del vector en el índice indicado, con
     * @param   {Integer} índice
     * @returns {Array} [lon, lat];
     */
    lonLatEnIndice(i) {
        let indicey = Math.floor(i / this.ncols());
        //var lat = this.y0 + (indicey * this.dy); // y-ascending
        let lat = this.y1 - (indicey * this.dy); // y-descending

        let indicex = i % this.ncols();
        let lon = this.x0 + (indicex * this.dx);

        return [lon, lat];

        /*
        redondeado
        let PRECISION_LON_LAT = 8;
        let lonR = this._redondeo(lon, PRECISION_LON_LAT);
        let latR = this._redondeo(lat, PRECISION_LON_LAT);
        return [lonR, latR];
        */
    }

    /**
     * Valores del vector en las coordenadas longitud-latitud
     * @param   {Number} lon - Longitud
     * @param   {Number} lat - Latitud
     * @returns {Array}   [u, v]
     */
    valorEn(lon, lat) {
        if (!this.dentroDeEncuadre(lon, lat)) {
            return null;
        }

        //let posy = (lat - this.y0) / this.dy * this.ncols(); // y-ascending
        let posy = (this.y1 - lat) / this.dy * this.ncols(); // y-ascending
        let posx = (lon - this.x0) / this.dx;

        return this.vector(posy + posx);
    }



    /**
     * Objeto {Vector} en un punto lon lat.
     * @param   {[[Type]]} lon [[Description]]
     * @param   {[[Type]]} lat [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    vectorEn(lon, lat) {
        let uv = this.valorEn(lon, lat);
        if (uv !== null) {

            let ur = this._redondeo(uv[0], this.PRECISION_UV);
            let vr = this._redondeo(uv[1], this.PRECISION_UV);
            return new Vector(ur, vr);
        } else {
            return null; // TODO...
        }
    }

    tieneValorEn(lon, lat) {
        return this.valorEn(lon, lat) !== null;
    }





    /**
     * Tomado de https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
     * @private
     * @param   {[[Type]]} number    [[Description]]
     * @param   {[[Type]]} precision [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    _redondeo(number, precision) {
        var factor = Math.pow(10, precision);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    }
}
