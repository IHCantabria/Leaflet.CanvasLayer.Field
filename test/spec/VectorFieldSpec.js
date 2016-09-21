describe("VectorField", function () {
    var vf;
    beforeEach(function (done) {
        // Test data from IH-COAWST
        d3.json("../../data/test.json", function (d) {
            vf = VectorField.fromJson(d);
            done();
        });
    });

    describe("Grid", function () {
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
        });

        it("can calculate the range of its magnitudes", function () {
            var range = vf.magnitudeRange();
            expect(range).not.toBe(null);

            // min-max velocity
            expect(range[0]).toEqual(0.0067317434565905545);
            expect(range[1]).toEqual(0.2150247092568961);
        });
    });

    describe("Positions", function () {

        it("can return vector data for (i, j) indexes in the grid", function () {
            // top-left
            expect(vf._valueAtIndexes(0, 0)).toEqual(new Vector(0.011275325901806355, -0.003540651174262166));

            // botton-right
            expect(vf._valueAtIndexes(9, 9)).toEqual(new Vector(0.14851005375385284, -0.015279672108590603));
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
    });

    describe("Lon-Lat", function () {

        it("returns [u, v] values for a Lon-Lat ", function () {
            // near the center of the LL cell [up & right]
            var pNearLL = vf.valueAt(-3.76921724303, 43.4605948227);
            expect(pNearLL.u).toBeCloseTo(0.00586759205907583, 4);
            expect(pNearLL.v).toBeCloseTo(-0.00329965655691922, 4);

            // near the center of the UL cell [down & right]
            var pNearUL = vf.valueAt(-3.76921740247, 43.4651398993);
            expect(pNearUL.u).toBeCloseTo(0.01127532590180643, 4);
            expect(pNearUL.v).toBeCloseTo(-0.00354065117426217, 4);

            // near the center of the UR cell [down & left]
            var pNearUR = vf.valueAt(-3.76467191838, 43.4651400146);
            expect(pNearUR.u).toBeCloseTo(0.215018898248672, 4);
            expect(pNearUR.v).toBeCloseTo(-0.00158081843983382, 4);

            // near the center of the LR cell [up & left]
            var pNearLR = vf.valueAt(-3.76467191746, 43.4605944395);
            expect(pNearLR.u).toBeCloseTo(0.148510053753853, 4);
            expect(pNearLR.v).toBeCloseTo(-0.0152796721085906, 4);
        });

        it("doesn't return values for a Lon-Lat outside of the grid", function () {
            let lon = -3.710591474014617;
            let lat = 43.47082043045964;
            expect(vf.hasValueAt(lon, lat)).toBe(false);
        });
    });

});
