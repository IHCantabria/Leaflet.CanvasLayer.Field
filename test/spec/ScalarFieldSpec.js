describe("ScalarField", function () {
    let sf;

    beforeEach(function (done) {
        // Test data from IH-COAWST
        d3.json("../../data/testZ.json", function (d) {
            sf = new ScalarField(d);
            done();
        });
    });

    it("can be created from an ASCIIGrid file", function () {
        d3.text("../../data/porcion-us.asc", function (asc) {
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
});
