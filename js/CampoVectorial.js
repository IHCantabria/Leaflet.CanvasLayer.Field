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

    /*    ncols() {

            //return Math.round((this.x1 - this.x0) / this.dx + 1);
        }

        nfilas() {
            return Math.round((this.y1 - this.y0) / this.dy + 1);
        }
        */

    nVectores() {
        return this.us.length;
    }


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

    dentroDeEncuadre(lon, lat) {
        let xs = [
            this._redondeo(this.x0, this.PRECISION_LON_LAT),
            this._redondeo(this.x1, this.PRECISION_LON_LAT),
        ]

        let ys = [
            this._redondeo(this.y0, this.PRECISION_LON_LAT),
            this._redondeo(this.y1, this.PRECISION_LON_LAT),
        ]

        let lonR = this._redondeo(lon, this.PRECISION_LON_LAT);
        let latR = this._redondeo(lat, this.PRECISION_LON_LAT);

        return (lonR >= xs[0] && lonR <= xs[1] && latR >= ys[0] && latR <= ys[1]);
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

    posicionAleatoria(o = {}) {
        let pos = _.random(0, this.nVectores() - 1);
        var lonlat = this.lonLatEnIndice(pos);

        o.x = lonlat[0];
        o.y = lonlat[1];
        return o;
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
