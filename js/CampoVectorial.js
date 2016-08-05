class CampoVectorial {
    constructor(x0, y0, x1, y1, dxy) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.dx = dxy;
        this.dy = dxy;

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
        let u = this.componenteU[i],
            v = this.componenteV[i];
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
     * Valor en las coordenadas longitud-latitud
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

    tieneValorEn(lon, lat) {
        return this.valorEn(lon, lat) !== null;
    }

    posicionAleatoria(o = {}) {
        let x, y;
        let safetyNet = 0;
        do {
            x = Math.round(_.random(this.x0, this.x1));
            y = Math.round(_.random(this.y0, this.y1));
        } while (!this.tieneValorEn(x, y) && safetyNet++ < 30);


        o.x = x;
        o.y = y;
        return o;
    }


}
