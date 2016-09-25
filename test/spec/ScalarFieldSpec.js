describe("ScalarField", function () {
    let asc;
    beforeEach(function (done) {
        d3.text("../../data/porcion-us.asc", function (txt) {
            asc = txt;
            done();
        });
    });

    it("can be created from ASCIIGrid text", function () {
        let g = ScalarField.fromASCIIGrid(asc);
        expect(g).not.toBe(null);

        expect(g.ncols).toEqual(10);
        expect(g.nrows).toEqual(10);
        expect(g.xllcorner).toEqual(-3.769470033164);
        expect(g.yllcorner).toEqual(43.460341898838);
        expect(g.cellsize).toEqual(0.000505065545);
    });
});
