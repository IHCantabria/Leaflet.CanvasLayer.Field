describe("VectorField", function () {
    let vf;

    beforeEach(function (done) {
        // Test data from IH-COAWST
        d3.json("../../data/testUV.json", function (d) {
            vf = new VectorField(d);
            done();
        });
    });

    describe("ASCIIGrid", function () {
        let ascU, ascV;

        beforeEach(function (filesLoaded) {
            d3.text("../../data/porcion-us.asc", function (u) {
                d3.text("../../data/porcion-vs.asc", function (v) {
                    ascU = u;
                    ascV = v;
                    filesLoaded();
                });
            });
        });

        it("can be created from two ASCIIGrid files", function () {
            let v = VectorField.fromASCIIGrids(ascU, ascV);
            expect(v).not.toBe(null);
            expect(v.ncols).toEqual(10);
            expect(v.nrows).toEqual(10);
            expect(v.xllcorner).toEqual(-3.769470033164);
            expect(v.yllcorner).toEqual(43.460341898838);
            expect(v.cellsize).toEqual(0.000505065545);
            expect(v.grid).not.toBe(null);
        });
    });

    it("can return the Vector for (i, j) indexes in the grid", function () {
        // top-left
        expect(vf._valueAtIndexes(0, 0)).toEqual(new Vector(0.011275325901806355, -0.003540651174262166));

        // botton-right
        expect(vf._valueAtIndexes(9, 9)).toEqual(new Vector(0.14851005375385284, -0.015279672108590603));
    });

    it("can return the Vector for a Lon-Lat ", function () {
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

    it("can calculate the range of its magnitudes", function () {
        var range = vf.magnitudeRange();
        expect(range).not.toBe(null);

        // min-max velocity
        expect(range[0]).toEqual(0.0067317434565905545);
        expect(range[1]).toEqual(0.2150247092568961);
    });

});
