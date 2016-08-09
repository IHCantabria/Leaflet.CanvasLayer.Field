// orden de vectores, el del ASCIIGrid (left->right & top ->down)
// x-ascending
// y-descending
class CampoVectorial {
    constructor(params) {
        this.x0 = params["x0"];
        this.y0 = params["y0"];
        this.x1 = params["x1"];
        this.y1 = params["y1"];

        this.dx = params["dx"];
        this.dy = params["dy"];

        // TODO verificar longitudes por pares
        this.us = params["us"];
        this.vs = params["vs"];
    }

    ncols() {
        return Math.round((this.x1 - this.x0) / this.dx + 1);
    }

    nfilas() {
        return Math.round((this.y1 - this.y0) / this.dy + 1);
    }

    nVectores() {
        return this.us.length;
    }


    /**
     * Devuelve el 'n' vector
     * @param   {Integer} índice de vector
     * @returns {Array} [u, v]
     */
    vector(i) {
        let ir = Math.round(i); // TODO. revisar precisión...
        let u = this.us[ir],
            v = this.vs[ir];
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
            let PRECISION_UV = 8;
            let ur = this._redondeo(uv[0], PRECISION_UV);
            let vr = this._redondeo(uv[1], PRECISION_UV);
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
     * La lista de puntos LonLat que configura la malla
     */
    malla() {
        let lista = [];
        for (var i = 0; i < this.nVectores(); i++) {
            lista.push(this.lonLatEnIndice(i));
        }
        return lista;
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
