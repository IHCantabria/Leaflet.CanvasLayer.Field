describe("CapaSimple", function () {
    var capa;
    beforeEach(function () {
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
        capa = new CapaSimple(ptos);
    });


    it("es una capa Leaflet con ptos", function () {
        expect(capa instanceof CapaSimple).toBe(true);
        expect(capa.ptos.length).toBeGreaterThan(0);
    });
});
