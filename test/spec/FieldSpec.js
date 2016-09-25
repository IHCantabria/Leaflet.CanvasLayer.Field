describe("Field", function () {
    var vf;

    beforeEach(function (done) {
        // Test data from IH-COAWST
        d3.json("../../data/testUV.json", function (d) {
            vf = new VectorField(d);
            done();
        });
    });

    it("gives general info about its cells and extent", function () {
        expect(vf.ncols).toEqual(10);
        expect(vf.nrows).toEqual(10);

        let xmin = -3.769470033164;
        let ymin = 43.460341898838;
        let xmax = -3.764419377714;
        let ymax = 43.465392554288;

        expect(vf.xllcorner).toEqual(xmin);
        expect(vf.yllcorner).toEqual(ymin);
        expect(vf.xurcorner).toBeCloseTo(xmax, 8);
        expect(vf.yurcorner).toBeCloseTo(ymax, 8);

        expect(vf.numCells()).toEqual(100);
    });

    it("is a regular grid with ncols & nrows", function () {
        var i = vf.grid.length;
        var j = vf.grid[0].length;
        expect(i).toBe(vf.nrows);
        expect(j).toBe(vf.ncols);
    });

    it("can generate a random position inside", function () {
        var pos = vf.randomPosition();
        expect(pos).not.toBe(null);
        expect(vf.contains(pos.x, pos.y)).toBe(true);

        var pos2 = vf.randomPosition();
        expect(pos2).not.toBe(pos);
    });

    it("knows the Longitude & Latitude for each cell", function () {
        // longitudes
        let xminCenter = vf._longitudeAtX(0);
        expect(xminCenter).toBeCloseTo(-3.7692175003915001, 6);

        let xmaxCenter = vf._longitudeAtX(9);
        expect(xmaxCenter).toBeCloseTo(-3.7646719104865003, 6);

        // latitudes
        let ymaxCenter = vf._latitudeAtY(0);
        expect(ymaxCenter).toBeCloseTo(43.465140021515502, 6);

        let yminCenter = vf._latitudeAtY(9);
        expect(yminCenter).toBeCloseTo(43.460594431610502, 6);

        //
        var first = vf._lonLatAtIndexes(0, 0);
        expect(first[0]).toBeCloseTo(-3.7692175003915001, 7);
        expect(first[1]).toBeCloseTo(43.465140021515502, 7);

        var last = vf._lonLatAtIndexes(9, 9);
        expect(last[0]).toBeCloseTo(-3.7646719104865003, 7);
        expect(last[1]).toBeCloseTo(43.460594431610502, 7);

        //
        var p = vf._lonLatAtIndexes(0, 8);
        expect(p[0]).toBeCloseTo(-3.7692175001640003, 7);
        expect(p[1]).toBeCloseTo(43.461099497838006, 7);
    });

    it("doesn't return a Value for a Lon-Lat outside of the grid", function () {
        let lon = -3.710591474014617;
        let lat = 43.47082043045964;
        expect(vf.hasValueAt(lon, lat)).toBe(false);
    });

});
