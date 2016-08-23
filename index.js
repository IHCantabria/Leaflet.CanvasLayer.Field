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
d3.json("data/grid_BAHIA.json", function (d) {
    let cv = CampoVectorial.desdeJson(d);

    // 0. Grid base
    let capaGrid = new CapaPuntos(cv.mallaLonLatUV());
    //capaGrid.addTo(mapa);

    // 1. Básica
    let capa = new CapaVectorAnimado(cv);
    //capa.addTo(mapa);

    // 2. Cambio de color
    let capa2 = new CapaVectorAnimado(cv, {
        color: "green"
    });
    //capa2.addTo(mapa);

    // 3. Más parámetros personalizados
    let capa3 = new CapaVectorAnimado(cv, {
        trayectorias: 150,
        duracion: 20,
        edadMaxima: 200,
        color: "yellow",
        grosor: 3
    });
    //capa3.addTo(mapa);

    // 4. Capa con color por velocidad y leyenda
    var m = MapaColor.paraCorrientes([0, 1.1]);
    let capa4 = new CapaVectorAnimado(cv, {
        color: m.escala
    });
    capa4.addTo(mapa);

    L.Control.leyendaEscalaColor(m).addTo(mapa);
    //mapa.addControl(leyenda);

    // 5. Identificación con click
    capa4.on('click_vector', function (e) {
        console.log('has hecho click: ', e);
    });


});
