class CampoVectorial {
    constructor(x0, y0, x1, y1, dx, dy) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.dx = dx;
        this.dy = dy;

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
        let ir = Math.round(i);
        let u = this.componenteU[ir],
            v = this.componenteV[ir];
        let valido = (u !== null && u !== undefined && v !== null & v !== undefined);
        return valido ? [u, v] : null;
    }


    /**
     * Devuelve las coordenadas del vector en el índice indicado
     * @param   {Integer} índice
     * @returns {Array} [lon, lat];
     */
    lonLatEnIndice(i) {
        var indicey = Math.floor(i / this.ncols());
        var lat = this.y0 + (indicey * this.dy);

        var indicex = i % this.ncols();
        var lon = this.x0 + (indicex * this.dx);

        return [lon, lat];
    }

    /**
     * Valores del vector en las coordenadas longitud-latitud
     * @param   {[[Type]]} lon [[Description]]
     * @param   {[[Type]]} lat [[Description]]
     * @returns {Array}   [u, v]
     */
    valorEn(lon, lat) {
        // Los datos se almacenan en x-ascendente y luego y-ascendente
        let posy = (lat - this.y0) / this.dy * this.ncols();
        let posx = (lon - this.x0) / this.dx;

        return this.vector(posy + posx);
    }

    vectorEn(lon, lat) {
        let uv = this.valorEn(lon, lat);

        if (uv !== null) {
            return new Vector(uv[0], uv[1]);
        } else {
            return null;
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


}
