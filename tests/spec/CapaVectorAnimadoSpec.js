describe("CapaVectorAnimado", function () {
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
        capa = new CapaVectorAnimado(ptos);
    });


    it("es una CapaVectorAnimado con ptos", function () {
        expect(capa instanceof CapaVectorAnimado).toBe(true);
        expect(capa.campoVectorial).not.toBe(null);
    });
});
