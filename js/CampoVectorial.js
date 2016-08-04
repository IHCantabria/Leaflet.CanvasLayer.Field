class CampoVectorial {
    constructor(x0, y0, x1, y1, dxy, campo) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.dx = dxy;
        this.dy = dxy;
        //        this.campo = campo;

        this.componenteU = [];
        this.componenteV = [];
    }


    ncols() {
        return (this.x1 - this.x0) / this.dx + 1;
    }

    nfilas() {
        return (this.y1 - this.y0) / this.dy + 1;
    }

    nVectores() {
        return (this.ncols() * this.nfilas());
    }


    /**
     * Devuelve el 'n' vector
     * @param   {Integer} índice de vector
     * @returns {Array} [u, v]
     */
    vector(i) {
        var u = this.componenteU[i],
            v = this.componenteV[i];
        var valido = (u !== null && u !== undefined && v !== null & v !== undefined);
        return valido ? [u, v] : null;
    }

    /**
     * Valor en las coordenadas longitud-latitud
     * @param   {[[Type]]} lon [[Description]]
     * @param   {[[Type]]} lat [[Description]]
     * @returns {Array}   [u, v]
     */
    valorEn(lon, lat) {
        // Los datos se almacenan en por filas (x-ascendente) y luego y-ascendente

        var posy = (lat - this.y0) / this.dy * this.ncols();
        var posx = (lon - this.x0) / this.dx;

        return this.vector(posy + posx);
        /*
        var x = this._filaLat(lat);
        var y = this._columnaLon(lon);

        return this.campo[x][y];
        */
    }

    posicionAleatoria(o = {}) {
        var x, y;
        var safetyNet = 0;
        do {
            x = Math.round(_.random(this.x0, this.x1));
            y = Math.round(_.random(this.y0, this.y1));
        } while (!this.tieneValorEn(x, y) && safetyNet++ < 30);
        o.x = x;
        o.y = y;
        return o;
    }

    tieneValorEn(lon, lat) {
        return this.valorEn(lon, lat) !== null;
    }

    /**
     * Índice de fila para Latitud, desde 0
     * @param   {float} lat Latitud EPSG:4326
     * @returns {integer} Índice de fila donde buscar el valor de campo
     */
    _filaLat(lat) {
        var indiceX = (lat - this.y0) / this.dy;
        return Math.round(indiceX);
    }

    /**
     * Índice de columna para Longitud, desde 0
     * @param   {float} lon Longitud EPSG:4326
     * @returns {integer} Índice de columna donde buscar el valor de campo
     */
    _columnaLon(lon) {
        var indiceY = (lon - this.x0) / this.dx;
        return Math.round(indiceY);
    }
}
