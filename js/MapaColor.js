/**
    Clase para mapas de color, basado en chromajs
    http://gka.github.io/chroma.js/
*/
class MapaColor {
    constructor(escala, dominio) {
        this.escala = escala;
        this.dominio = dominio;
    }

    static paraCorrientes(dominio = [0, 2]) {
        // Tipo sst_36 azul--->rojo
        // Valores desde 0 a 2 m/s
        //return chroma.scale(['#00008F', '#8C0000']).domain(dominio);

        let escala = chroma.scale(['cyan', 'red']).domain(dominio);
        let mapa = new MapaColor(escala, dominio);
        return mapa;
    }
}

/* ¿para leyendas?
http://jsfiddle.net/ramnathv/g8stqcf6/
http://jsfiddle.net/vis4/cYLZH/
*/
