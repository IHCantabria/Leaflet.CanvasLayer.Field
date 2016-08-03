/* Preparación de Mapa */
const map = L.map("map").setView([43.45, -3.7944], 12);
const ancho = 500;

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);



d3.csv("data/puntos_bahia_uv.csv", function (data) {
    let ptos = data.map(function (d) {
        d.latlng = new L.latLng(+d.lat, +d.lon);
        d.lon = +d.lon;
        d.lat = +d.lat;
        d.dir = +d.dir; // direccion
        d.vel = +d.vel; // velocidad
        d.u = +d.u; // componentes vectoriales U|V
        d.v = +d.v;
        return d;
    });


    /* Capa Canvas */
    var capa = new CapaVectorAnimado(ptos);
    capa.addTo(map);

});
