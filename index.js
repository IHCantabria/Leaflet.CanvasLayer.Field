"use strict";

/* Preparación de Mapa */
const mapa = L.map("map").setView([43.45, -3.7944], 12);
const ancho = 500;

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(mapa);


d3.json("data/grid.json", function (d) {
    console.log(data.x0);

    /*constructor(x0, y0, x1, y1, dxy) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.dx = dxy;
        this.dy = dxy;

        this.componenteU = [];
        this.componenteV = [];
    }
    */


    let campo = new CampoVectorial(d.x0, d.y0, d.x1, d.y1, d.dx, d.dy);
    campo.componenteU = d.componenteU;
    campo.componenteV = d.componenteV;

    let capa = new CapaVectorAnimado(campo);
    capa.addTo(mapa);
});

/*
d3.csv("data/puntos_bahia_uv.csv", function (data) {
    let ptos = data.map(function (d) {
        d.POINTID = +d.POINTID;
        d.latlng = new L.latLng(+d.lat, +d.lon);
        d.lon = +d.lon;
        d.lat = +d.lat;
        d.dir = +d.dir; // direccion
        d.vel = +d.vel; // velocidad
        d.u = +d.u; // componentes vectoriales U|V
        d.v = +d.v;
        return d;
    });
    var capa = new CapaVectorAnimado(ptos);
    capa.addTo(map);

});
*/
