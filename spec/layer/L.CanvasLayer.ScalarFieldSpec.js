describe('L.CanvasLayer.ScalarField', function() {
    let ScalarField = L.ScalarField;

    let dataFolder = 'base/docs/data';
    let c, map, sf;

    beforeEach(function(fileLoaded) {
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
        d3.text(`${dataFolder}/U.asc`, function(z) {
            sf = ScalarField.fromASCIIGrid(z);
            fileLoaded();
        });
    });

    afterEach(function() {
        document.body.removeChild(c);
    });

    it('can be added to the map', function() {
        let sfl = L.canvasLayer.scalarField(sf).addTo(map);
        expect(map.hasLayer(sfl)).toBe(true);
    });

    it('has bounds', function() {
        let sfl = L.canvasLayer.scalarField(sf);
        expect(sfl.getBounds()).not.toBe(null);
    });

    it('can receive data after creation', function() {
        let sfl = L.canvasLayer.scalarField().addTo(map);
        sfl.setData(sf);
        expect(sf).not.toBe(null);
    });

    // TODO
    /*
    it('can be painted with default renderer', function () {
        let sfl = L.canvasLayer.scalarField(sf).addTo(map);
        map.fitBounds(sfl.getBounds());

        let halfCell = sf.cellsize / 2.0;

        let upperRight = L.latLng(
            sf.yurcorner - halfCell, sf.xurcorner - halfCell);
        let p = map.latLngToContainerPoint(upperRight);
        let color = sfl.getPixelColor(p.x, p.y);
        expect(color).toEqual(chroma('black'));

        let lowerLeft = L.latLng(
            sf.yllcorner + halfCell, sf.xllcorner + halfCell);
        let p2 = map.latLngToContainerPoint(lowerLeft);
        let color2 = chroma(sfl.getPixelColor(p2.x, p2.y));
        expect(color2).toEqual(chroma('white'));
    });
*/
});
