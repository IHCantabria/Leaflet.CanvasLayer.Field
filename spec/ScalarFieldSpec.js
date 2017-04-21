describe('ScalarField', function () {
    let ScalarField = L.ScalarField;
    let Cell = L.Cell;

    let dataFolder = '../../docs/data';


    describe("ASCII Grid format", function () {
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

        it('can return the value for a (lon, lat)', function () {
            /* Testing 2 points for each corner
                a) near the center of the cell
                b) near the edges
            */

            // LL
            let pNearLL = sf.valueAt(-3.76921724303, 43.4605948227);
            let ll = sf.valueAt(-3.76944, 43.46038);
            let llValue = 0.00586759205907583;
            expect(pNearLL).toBeCloseTo(llValue, 4);
            expect(ll).toBeCloseTo(llValue, 4);

            // UL
            let pNearUL = sf.valueAt(-3.76921740247, 43.4651398993);
            let ul = sf.valueAt(-3.76945, 43.46537);
            let ulValue = 0.01127532590180643;
            expect(pNearUL).toBeCloseTo(ulValue, 4);
            expect(ul).toBeCloseTo(ulValue, 4);

            // UR
            let pNearUR = sf.valueAt(-3.76467191838, 43.4651400146);
            let ur = sf.valueAt(-3.76447, 43.46534);
            let urValue = 0.215018898248672;
            expect(pNearUR).toBeCloseTo(urValue, 4);

            // LR
            let pNearLR = sf.valueAt(-3.76467191746, 43.4605944395);
            let lr = sf.valueAt(-3.76443, 43.46036);
            let lrValue = 0.148510053753853;
            expect(pNearLR).toBeCloseTo(lrValue, 4);
        });

        it('can return its cells', function () {
            let grid = sf.getCells();
            let p0 = grid[0];
            let pN = grid[grid.length - 1];

            let first = new Cell(L.latLng(43.4651400215155, -3.7692175003915),
                0.011275325901806355, sf.cellSize);
            expect(p0.equals(first)).toBe(true);

            let last = new Cell(L.latLng(43.46059443161051, -3.7646719104864994),
                0.14851005375385284, sf.cellSize);
            expect(pN.equals(last)).toBe(true);
        });

        it('can calculate the Range of its values', function () {
            expect(sf.range).not.toBe(null);
            expect(sf.range[0]).toBeCloseTo(0.0058675920590758, 8);
            expect(sf.range[1]).toBeCloseTo(0.21501889824867, 8);
        });

        it('can be filtered', function () {
            const min = 0.1;
            const max = 0.15;

            expect(sf.range[0] >= min).toBeFalsy();
            expect(sf.range[1] <= max).toBeFalsy();

            sf.setFilter(function (v) {
                return v >= min && v <= max;
            });

            expect(sf.range[0] >= min).toBeTruthy();
            expect(sf.range[1] <= max).toBeTruthy();
        });

    });

    describe("Geotiff format", function () {
        let sf;

        beforeEach(function (fileLoaded) {
            d3.request(`${dataFolder}/tz850.tiff`).responseType('arraybuffer').get(function (error, tiffData) {
                sf = ScalarField.fromGeoTIFF(tiffData.response);
                fileLoaded();
            });
        });

        it('can be created from a GeoTIFF file', function () {
            expect(sf).not.toBe(null);
        });


    });
});
