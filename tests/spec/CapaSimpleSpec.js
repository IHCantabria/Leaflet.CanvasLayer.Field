describe("CapaSimple", function () {
    let ptos = [];
    ptos.push({
        latlng: new L.latLng(43.52, -3.70),
        dir: 90,
        el: 0.86
    });
    ptos.push({
        latlng: new L.latLng(43.52, -3.75),
        dir: 90,
        el: 0.82
    });
    it("es una capa Leaflet con ptos", function () {
        var capa = new CapaSimple(ptos);
        expect(capa.ptos.length).toBeGreaterThan(0);
    });
});
