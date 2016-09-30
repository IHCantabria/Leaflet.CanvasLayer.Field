describe("ScalarField", function () {
    let dataFolder = "../../docs/data";
    let sf;

    beforeEach(function (done) {
        // Test data from IH-COAWST
        d3.json(`${dataFolder}/testZ.json`, function (d) {
            sf = new ScalarField(d);
            done();
        });
    });

    describe("ASCIIGrid", function () {
        let asc;

        beforeEach(function (fileLoaded) {
            d3.text(`${dataFolder}/porcion-us.asc`, function (z) {
                asc = z;
                fileLoaded();
            });
        });

        it("can be created from an ASCIIGrid file", function () {
            let s = ScalarField.fromASCIIGrid(asc);
            expect(s).not.toBe(null);
            expect(s.ncols).toEqual(10);
            expect(s.nrows).toEqual(10);
            expect(s.xllcorner).toEqual(-3.769470033164);
            expect(s.yllcorner).toEqual(43.460341898838);
            expect(s.cellsize).toEqual(0.000505065545);
            expect(s.grid).not.toBe(null);
        });
    });

    it("can return the Number for (i, j) indexes in the grid", function () {
        // top-left
        expect(sf._valueAtIndexes(0, 0)).toEqual(0.011275325901806355);

        // botton-right
        expect(sf._valueAtIndexes(9, 9)).toEqual(0.14851005375385284);
    });

    it("can return the Vector for a Lon-Lat ", function () {
        // near the center of the LL cell [up & right]
        let pNearLL = sf.valueAt(-3.76921724303, 43.4605948227);
        expect(pNearLL).toBeCloseTo(0.00586759205907583, 4);

        // near the center of the UL cell [down & right]
        let pNearUL = sf.valueAt(-3.76921740247, 43.4651398993);
        expect(pNearUL).toBeCloseTo(0.01127532590180643, 4);

        // near the center of the UR cell [down & left]
        let pNearUR = sf.valueAt(-3.76467191838, 43.4651400146);
        expect(pNearUR).toBeCloseTo(0.215018898248672, 4);

        // near the center of the LR cell [up & left]
        let pNearLR = sf.valueAt(-3.76467191746, 43.4605944395);
        expect(pNearLR).toBeCloseTo(0.148510053753853, 4);
    });

});
