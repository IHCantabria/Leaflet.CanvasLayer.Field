"use strict";

/* Preparación de Mapa */
const mapa = L.map("map").setView([43.45, -3.7944], 12);
const ancho = 500;

let url = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
//let url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';

L.tileLayer(url, {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(mapa);


d3.json("data/porcion.json", function (d) {
    let params = {
        "x0": d.x0,
        "y0": d.y0,
        "x1": d.x1,
        "y1": d.y1,
        "dx": d.dx,
        "dy": d.dy,
        "us": d.us,
        "vs": d.vs
    };

    let campo = new CampoVectorial(params);
    let capa = new CapaVectorAnimado(campo, true);
    capa.addTo(mapa);
});
