/* Preparación de Mapa */
const map = L.map("map").setView([43.45, -3.7944], 12);
const ancho = 500;

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

/* Preparación de capa SVG */
map._initPathRoot();
var svg = d3.select("#map").select("svg");
var g = svg.append("g");

/**
 * Coordenada en mapa para pintar en SVG
 * @param   {L.LatLng} latlon - objeto punto longitud / latitud
 * @returns {L.Point} - punto con coordenadas x, y en píxels
 */
function point2map(latlon) {
    return map.latLngToLayerPoint(latlon);
}

/**
 * Genera un path SVG para cada punto, con una longitud 'inventada'
 * @param {L.LatLng} pto - punto  origen
 */
function lineaVector(d) {
    let pto0 = d.latlng;
    let pto1 = L.GeometryUtil.destination(pto0, d.dir, ancho) // línea n metros
    let p0 = point2map(pto0); // origen
    let p1 = point2map(pto1); // origen
    let p = `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y}`
    return p;
}
/**
 * Anima un path individual
 * @param   {[[Type]]} p [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
function animarPath(p) {
    let l = p.getTotalLength();
    var path = d3.select(p);
    (function repetir() {
        path.attr("stroke-dasharray", function() {
                return `${l} ${l} `;
            })
            .attr("stroke-dashoffset", `${l}`)
            .transition()
            .duration(3000)
            .ease("linear")
            .attr("stroke-dashoffset", 0)
            .each("end", repetir);
    })();
}

d3.csv("data/puntos_bahia.csv", function(data) {
    let ptos = data.map(function(d) {
        d.latlng = new L.latLng(+d.lat, +d.lon);
        d.dir = +d.dir; // direccion
        d.vel = +d.vel; // velocidad
        return d;
    });
    ptos = ptos.filter(function(e, i) {
        if (i % 20 === 0) return e;
    });
    let feature = g.selectAll("path")
        .data(ptos)
        .enter()
        .append("path")
        .style("stroke-width", 2)
        .style("stroke", "blue")
        .attr("d", lineaVector).each(function() {
            animarPath(this);
        });

    map.on("viewreset", update);
    update();

    function update() {
        feature.attr("d", lineaVector).each(function() {
            animarPath(this);
        });
    }
});
