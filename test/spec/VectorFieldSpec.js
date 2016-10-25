describe("VectorField", function () {
    let dataFolder = "../../docs/data";
    let vf;

    beforeEach(function (filesLoaded) {
        d3.text(`${dataFolder}/U.asc`, function (u) {
            d3.text(`${dataFolder}/V.asc`, function (v) {
                vf = VectorField.fromASCIIGrids(u, v);
                filesLoaded();
            });
        });
    });

    it("can be created from 2 ASCIIGrid files", function () {
        expect(vf).not.toBe(null);
    });

    it("can return the Vector for (i, j) indexes in the grid", function () {
        // top-left
        expect(vf._valueAtIndexes(0, 0)).toEqual(new Vector(0.011275325901806355, -0.003540651174262166));

        // botton-right
        expect(vf._valueAtIndexes(9, 9)).toEqual(new Vector(0.14851005375385284, -0.015279672108590603));
    });

    it("can return the Vector for a Lon-Lat ", function () {
        // near the center of the LL cell [up & right]
        let pNearLL = vf.valueAt(-3.76921724303, 43.4605948227);
        expect(pNearLL.u).toBeCloseTo(0.00586759205907583, 4);
        expect(pNearLL.v).toBeCloseTo(-0.00329965655691922, 4);

        // near the center of the UL cell [down & right]
        let pNearUL = vf.valueAt(-3.76921740247, 43.4651398993);
        expect(pNearUL.u).toBeCloseTo(0.01127532590180643, 4);
        expect(pNearUL.v).toBeCloseTo(-0.00354065117426217, 4);

        // near the center of the UR cell [down & left]
        let pNearUR = vf.valueAt(-3.76467191838, 43.4651400146);
        expect(pNearUR.u).toBeCloseTo(0.215018898248672, 4);
        expect(pNearUR.v).toBeCloseTo(-0.00158081843983382, 4);

        // near the center of the LR cell [up & left]
        let pNearLR = vf.valueAt(-3.76467191746, 43.4605944395);
        expect(pNearLR.u).toBeCloseTo(0.148510053753853, 4);
        expect(pNearLR.v).toBeCloseTo(-0.0152796721085906, 4);
    });

    it("can return GridLonLatValues", function () {
        let grid = vf.gridLonLatValue();
        let p0 = grid[0];
        let pN = grid[grid.length - 1];

        console.log(p0, pN);
        expect(p0).toEqual({
            lon: -3.7692175003915,
            lat: 43.4651400215155,
            value: new Vector(0.011275325901806355, -0.003540651174262166)
        });
        expect(pN).toEqual({
            lon: -3.7646719104864994,
            lat: 43.46059443161051,
            value: new Vector(0.14851005375385284, -0.015279672108590603)
        });
    });

    it("can calculate the Range of its values", function () {
        expect(vf.range).not.toBe(null);
        expect(vf.range[0]).toEqual(0.0067317434565905545);
        expect(vf.range[1]).toEqual(0.2150247092568961);
    });
});
