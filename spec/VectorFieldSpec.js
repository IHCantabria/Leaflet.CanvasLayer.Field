describe('VectorField', function() {
    let Vector = L.Vector;
    let Cell = L.Cell;
    let VectorField = L.VectorField;

    let dataFolder = 'base/docs/data';
    let vf;

    beforeEach(function(filesLoaded) {
        d3.text(`${dataFolder}/U.asc`, function(u) {
            d3.text(`${dataFolder}/V.asc`, function(v) {
                vf = VectorField.fromASCIIGrids(u, v);
                filesLoaded();
            });
        });
    });

    it('can be created from 2 ASCIIGrid files', function() {
        expect(vf).not.toBe(null);
    });

    it('can return the value for (i, j) indexes', function() {
        // top-left
        expect(vf._valueAtIndexes(0, 0)).toEqual(
            new Vector(0.011275325901806355, -0.003540651174262166)
        );

        // botton-right
        expect(vf._valueAtIndexes(9, 9)).toEqual(
            new Vector(0.14851005375385284, -0.015279672108590603)
        );
    });

    it('can return the value for a (lon, lat)', function() {
        // LL
        let pNearLL = vf.valueAt(-3.76921724303, 43.4605948227);
        expect(pNearLL.u).toBeCloseTo(0.00586759205907583, 4);
        expect(pNearLL.v).toBeCloseTo(-0.00329965655691922, 4);

        // UL
        let pNearUL = vf.valueAt(-3.76921740247, 43.4651398993);
        expect(pNearUL.u).toBeCloseTo(0.01127532590180643, 4);
        expect(pNearUL.v).toBeCloseTo(-0.00354065117426217, 4);

        // UR
        let pNearUR = vf.valueAt(-3.76467191838, 43.4651400146);
        expect(pNearUR.u).toBeCloseTo(0.215018898248672, 4);
        expect(pNearUR.v).toBeCloseTo(-0.00158081843983382, 4);

        // LR
        let pNearLR = vf.valueAt(-3.76467191746, 43.4605944395);
        expect(pNearLR.u).toBeCloseTo(0.148510053753853, 4);
        expect(pNearLR.v).toBeCloseTo(-0.0152796721085906, 4);
    });

    it('can return its cells', function() {
        let grid = vf.getCells();
        let p0 = grid[0];
        let pN = grid[grid.length - 1];

        expect(p0).not.toBe(null);
        expect(pN).not.toBe(null);
    });

    it('can calculate the Range of its values (magnitude)', function() {
        expect(vf.range).not.toBe(null);
        expect(vf.range[0]).toEqual(0.0067317434565905545);
        expect(vf.range[1]).toEqual(0.2150247092568961);
    });

    it('can be filtered', function() {
        const min = 0.1;
        const max = 0.15;

        expect(vf.range[0] >= min).toBeFalsy();
        expect(vf.range[1] <= max).toBeFalsy();

        vf.setFilter(function(v) {
            if (v) {
                const m = v.magnitude();
                return m >= min && m <= max;
            }
            return false;
        });

        expect(vf.range[0] >= min).toBeTruthy();
        expect(vf.range[1] <= max).toBeTruthy();
    });

    it('can return a ScalarField with its Magnitude or Direction', function() {
        let types = ['magnitude', 'directionTo', 'directionFrom'];
        for (var i = 0; i < 3; i++) {
            let s = vf.getScalarField(types[i]);
            expect(s).not.toBe(null);
        }
    });
});
