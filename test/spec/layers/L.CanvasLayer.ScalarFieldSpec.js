describe('L.CanvasLayer.ScalarField', function () {

    var c, map, cl_sf,
        center = [55.8, 37.6];

    beforeEach(function () {
        c = document.createElement('div');
        c.style.width = '400px';
        c.style.height = '400px';
        // Allow to use happen.at with determinist positions.
        c.style.position = 'absolute';
        c.style.top = '0';
        c.style.left = '0';
        document.body.appendChild(c);
        map = new L.Map(c);
        map.setView(center, 6);


        cl_sf
    });

    afterEach(function () {
        document.body.removeChild(c);
    });
});
