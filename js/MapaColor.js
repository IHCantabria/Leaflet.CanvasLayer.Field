/**
    Clase para mapas de color, basado en chromajs
    http://gka.github.io/chroma.js/
*/
class MapaColor {
    static paraCorrientes(dominio = [0, 2]) {
        // Tipo sst_36 azul--->rojo
        // Valores desde 0 a 2 m/s
        return chroma.scale(['#00008F', '#8C0000']).domain(dominio);
    }
}
