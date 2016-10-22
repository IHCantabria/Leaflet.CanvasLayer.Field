describe('L.CanvasLayer.ScalarField', function () {
    let dataFolder = "../../docs/data";
    let c, map, sf;

    beforeEach(function (fileLoaded) {
        // Map
        c = document.createElement('div');
        c.style.width = '400px';
        c.style.height = '400px';
        c.style.position = 'absolute';
        c.style.top = '0';
        c.style.left = '0';
        document.body.appendChild(c);
        map = new L.Map(c);

        // ASCIIGrid
        d3.text(`${dataFolder}/U.asc`, function (z) {
            sf = ScalarField.fromASCIIGrid(z);
            fileLoaded();
        });

    });

    afterEach(function () {
        document.body.removeChild(c);
    });


    it("can be added to the map", function () {
        let sfl = L.canvasLayer.scalarField(sf).addTo(map);
        expect(map.hasLayer(sfl)).toBe(true);
    });

    it("has bounds", function () {
        let sfl = L.canvasLayer.scalarField(sf);
        expect(sfl.getBounds()).not.toBe(null);
    });

    it("can be painted with default renderer", function () {
        let sfl = L.canvasLayer.scalarField(sf).addTo(map);
        map.fitBounds(sfl.getBounds());

        let p = map.latLngToContainerPoint()
    });

});
