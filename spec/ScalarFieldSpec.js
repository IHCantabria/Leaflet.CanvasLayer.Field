describe('ScalarField', function () {
    let ScalarField = L.ScalarField;
    let Cell = L.Cell;

    let dataFolder = '../../docs/data';
    let sf;

    beforeEach(function (fileLoaded) {
        d3.text(`${dataFolder}/U.asc`, function (z) {
            sf = ScalarField.fromASCIIGrid(z);
            fileLoaded();
        });
    });

    it('can be created from an ASCIIGrid file', function () {
        expect(sf).not.toBe(null);
    });

    it('can return the value for (i, j) indexes', function () {
        // top-left
        expect(sf._valueAtIndexes(0, 0)).toEqual(0.011275325901806355);

        // botton-right
        expect(sf._valueAtIndexes(9, 9)).toEqual(0.14851005375385284);
    });

    it('can return an interpolated value for a (lon, lat)', function () {
        // 1. Near the center of the cells, 'inside'
        // LL cell [up & right]
        let pNearLL = sf.valueAt(-3.76921724303, 43.4605948227);
        expect(pNearLL).toBeCloseTo(0.00586759205907583, 4);

        // UL cell [down & right]
        /*
        let pNearUL = sf.valueAt(-3.76921740247, 43.4651398993);
        expect(pNearUL).toBeCloseTo(0.01127532590180643, 4);
        */
        // UR cell [down & left]
        /*
        let pNearUR = sf.valueAt(-3.76467191838, 43.4651400146);
        expect(pNearUR).toBeCloseTo(0.215018898248672, 4);
        */
        // LR cell [up & left]
        /*
        let pNearLR = sf.valueAt(-3.76467191746, 43.4605944395);
        expect(pNearLR).toBeCloseTo(0.148510053753853, 4);
        */

        // 2. Near the corners, 'outside'
        // LL
        let ll = sf.valueAt(-3.76944, 43.46038);
        expect(ll).toBeCloseTo(0.00586759205907583, 4);


    });

    it('can return its cells', function () {
        let grid = sf.getCells();
        let p0 = grid[0];
        let pN = grid[grid.length - 1];

        let first = new Cell(L.latLng(43.4651400215155, -3.7692175003915),
            0.011275325901806355, sf.cellSize);
        expect(p0).toEqual(first);

        let last = new Cell(L.latLng(43.46059443161051, -3.7646719104864994),
            0.14851005375385284, sf.cellSize);

        expect(pN).toEqual(last);
    });

    it('can return a raster pyramid (resampled cells)', function () {
        var allCells = sf.getPyramid(1);
        expect(allCells.length).toBe(100);

        var quarterCells = sf.getPyramid(2);
        expect(quarterCells.length).toBe(25);

        var nCells = sf.getPyramid(4);
        expect(nCells.length).toBe(9);
    });

    it('can calculate the Range of its values', function () {
        expect(sf.range).not.toBe(null);
        expect(sf.range[0]).toBeCloseTo(0.0058675920590758, 8);
        expect(sf.range[1]).toBeCloseTo(0.21501889824867, 8);
    });

    /*
    it('can be filtered', function () {
        let filter = function (v) {
            return (v > 0 && v < 0.01);
        };

        expect(sf.every(filter), true);
    });
    */
});
