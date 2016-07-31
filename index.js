/* Preparación de Mapa */
const map = L.map("map").setView([0, 0], 1);
const ancho = 500;

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

/* Capa Canvas */
L.canvasLayer()
    .delegate(this)
    .addTo(map);

function onDrawLayer(info) {
    var ctx = info.canvas.getContext('2d');
    ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
    ctx.fillStyle = "rgba(255,0,0, 0.4)";
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if (info.bounds.contains([d[0], d[1]])) {
            dot = info.layer._map.latLngToContainerPoint([d[0], d[1]]);
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }
};
