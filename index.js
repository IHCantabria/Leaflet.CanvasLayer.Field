"use strict";

/* Preparación de Mapa */
const mapa = L.map("map").setView([43.45, -3.7944], 13);

//let url = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
let url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';

L.tileLayer(url, {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(mapa);

d3.json("data/grid.json", function (d) {
    let cv = CampoVectorial.desdeJson(d);

    let capaGrid = new CapaPuntos(cv.mallaLonLat(), 'gray');
    capaGrid.addTo(mapa);

    let capa = new CapaVectorAnimado(cv, true);
    capa.addTo(mapa);
});
