"use strict";

/* Preparación de Mapa */
const mapa = L.map("map").setView([43.45, -3.7944], 13);

/* Base */
//let url = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
let url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
L.tileLayer(url, {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(mapa);


/* Capas animadas */
d3.json("data/grid.json", function (d) {
    let cv = CampoVectorial.desdeJson(d);

    // Grid base
    let capaGrid = new CapaPuntos(cv.mallaLonLat());
    //capaGrid.addTo(mapa);

    // 1. Básica
    let capa = new CapaVectorAnimado(cv);
    capa.addTo(mapa);

    // 2. Cambio de color
    let capa2 = new CapaVectorAnimado(cv, {
        color: "green"
    });
    capa2.addTo(mapa);

    // 3. Más parámetros personalizados
    let capa3 = new CapaVectorAnimado(cv, {
        trayectorias: 150,
        duracion: 200,
        edadMaxima: 2000,
        color: "yellow",
        grosor: 1
    });
    capa3.addTo(mapa);
});
