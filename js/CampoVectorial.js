class CampoVectorial {
    constructor(x0, y0, x1, y1, dxy, campo) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.dx = dxy;
        this.dy = dxy;
        this.campo = campo;
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
         * Valor para longitud-latitud
         * @param   {[[Type]]} lon [[Description]]
         * @param   {[[Type]]} lat [[Description]]
         * @returns {Array}    [[Description]]
         */
    UV_LonLat(lon, lat) {
            var x = this.filaLat(lat);
            var y = this.columnaLon(lon);
            return this.campo[x][y];
        }
        /**
         * Índice de fila para Latitud, desde 0
         * @param   {float} lat Latitud EPSG:4326
         * @returns {integer} Índice de fila donde buscar el valor de campo
         */
    filaLat(lat) {
            var indiceX = (lat - this.y0) / this.dy;
            return indiceX;
        }
        /**
         * Índice de columna para Longitud, desde 0
         * @param   {float} lon Longitud EPSG:4326
         * @returns {integer} Índice de columna donde buscar el valor de campo
         */
    columnaLon(lon) {
        var indiceY = (lon - this.x0) / this.dx;
        return indiceY;
    }
}
