/**
    Clase para aplicar mapas de color, basado en chromajs
    http://gka.github.io/chroma.js/
*/
class MapaColor {
    /**
     * Nuevo mapacolor
     * @param   {Function} escala   - función de chroma.scale
     * @param   {Array} dominio - [min, max]
     * @param   {String} unidades - descripción corta de unidades, ej. 'm/s'
     * @returns {MapaColor}
     */
    constructor(escala, dominio, unidades) {
        this.escala = escala;
        this.dominio = dominio;
        this.unidades = unidades;
    }

    /**
     * Mapa por defecto para Velocidad de las Corrientes m/s
     * @param   {Array} dominio - por defecto de 0 a 2 m/s
     * @returns {MapaColor}
     */
    static paraCorrientes(dominio = [0, 2]) {
        // Valores desde 0 a 2 m/s
        //let escala = chroma.scale(['#00008F', '#8C0000']).domain(dominio); // Tipo sst_36 azul--->rojo
        let escala = chroma.scale('OrRd').domain(dominio);
        //let escala = chroma.scale(['cyan', 'red']).domain(dominio);
        let mapa = new MapaColor(escala, dominio, 'm/s');
        return mapa;
    }
}

/* ¿para leyendas?
http://jsfiddle.net/ramnathv/g8stqcf6/
http://jsfiddle.net/vis4/cYLZH/
*/
