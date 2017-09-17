describe('Field', function() {
    let Field = L.Field;
    let ScalarField = L.ScalarField;

    let dataFolder = '../../docs/data';
    let f;

    beforeEach(function(fileLoaded) {
        d3.text(`${dataFolder}/U.asc`, function(asc) {
            f = ScalarField.fromASCIIGrid(asc);
            fileLoaded();
        });
    });

    it('gives general info about its cells and extent', function() {
        expect(f.nCols).toEqual(10);
        expect(f.nRows).toEqual(10);

        let xmin = -3.769470033164;
        let ymin = 43.460341898838;
        let xmax = -3.764419377714;
        let ymax = 43.465392554288;

        expect(f.xllCorner).toEqual(xmin);
        expect(f.yllCorner).toEqual(ymin);
        expect(f.xurCorner).toBeCloseTo(xmax, 8);
        expect(f.yurCorner).toBeCloseTo(ymax, 8);

        const size = 0.000505065545;
        expect(f.cellXSize).toEqual(size);
        expect(f.cellYSize).toEqual(size);

        expect(f.numCells()).toEqual(100);
    });

    it('is a regular grid with nCols & nRows', function() {
        expect(f.grid).not.toBe(null);

        let i = f.grid.length;
        let j = f.grid[0].length;
        expect(i).toBe(f.nRows);
        expect(j).toBe(f.nCols);
    });

    it('can generate a random position inside', function() {
        let pos = f.randomPosition();
        expect(pos).not.toBe(null);
        expect(f.contains(pos.x, pos.y)).toBe(true);

        let pos2 = f.randomPosition();
        expect(pos2).not.toBe(pos);
    });

    it('knows the longitude & latitude for each cell', function() {
        // longitudes
        let xminCenter = f._longitudeAtX(0);
        expect(xminCenter).toBeCloseTo(-3.7692175003915001, 6);

        let xmaxCenter = f._longitudeAtX(9);
        expect(xmaxCenter).toBeCloseTo(-3.7646719104865003, 6);

        // latitudes
        let ymaxCenter = f._latitudeAtY(0);
        expect(ymaxCenter).toBeCloseTo(43.465140021515502, 6);

        let yminCenter = f._latitudeAtY(9);
        expect(yminCenter).toBeCloseTo(43.460594431610502, 6);

        //
        let first = f._lonLatAtIndexes(0, 0);
        expect(first[0]).toBeCloseTo(-3.7692175003915001, 7);
        expect(first[1]).toBeCloseTo(43.465140021515502, 7);

        let last = f._lonLatAtIndexes(9, 9);
        expect(last[0]).toBeCloseTo(-3.7646719104865003, 7);
        expect(last[1]).toBeCloseTo(43.460594431610502, 7);

        //
        let p = f._lonLatAtIndexes(0, 8);
        expect(p[0]).toBeCloseTo(-3.7692175001640003, 7);
        expect(p[1]).toBeCloseTo(43.461099497838006, 7);
    });

    it("doesn't return a value for a lon-lat outside of the grid ", function() {
        let lon = -3.710591474014617;
        let lat = 43.47082043045964;
        expect(f.hasValueAt(lon, lat)).toBe(false);
    });

    describe('Field [0-360º] (Simple 3 x 3 matrix)', function() {
        const f360 = new ScalarField({
            nCols: 3,
            nRows: 3,
            xllCorner: 0,
            yllCorner: -90,
            cellXSize: 120,
            cellYSize: 60,
            zs: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        });

        it('supports 0-360 longitudes', function() {
            expect(f360.longitudeNeedsToBeWrapped).toBe(true);
        });

        it('returns wrapped extent', function() {
            // const original = [ 0, -90, 360, 90 ];
            const expected = [-180, -90, 180, 90];
            expect(expected).toEqual(f360.extent());
        });

        it('contains points in [-180, 180] range', function() {
            expect(f360.contains(-180, 0)).toBe(true);
            expect(f360.contains(0, 0)).toBe(true);
            expect(f360.contains(180, 0)).toBe(true);
        });

        it('returns wrapped longitudes for cells', function() {
            // longitudes (center at first and last columns)
            let xminCenter = f360._longitudeAtX(0);
            expect(xminCenter).toBe(60);
            let xmaxCenter = f360._longitudeAtX(2);
            expect(xmaxCenter).toBe(-60); // 300º >> -60

            // //
            let first = f360._lonLatAtIndexes(0, 0); //topLeft
            expect(first).toEqual([60, 60]);

            let last = f360._lonLatAtIndexes(2, 2); // bottomRight
            expect(last).toEqual([-60, -60]);
        });

        it('returns values & interpolated values', function() {
            // some values
            const a = -0.43;
            expect(a).toBe(f360.valueAt(0, 90)); // first value at .asc
            const b = -1.35;
            expect(b).toBe(f360.valueAt(0, -90));
            const c = 1.35;
            expect(c).toBe(f360.valueAt(-180, -90));

            // and some interpolated...
            expect(f360.interpolatedValueAt(0, 90)).not.toBe(a);
            expect(f360.interpolatedValueAt(0, -90)).not.toBe(b);
            expect(f360.interpolatedValueAt(-180, -90)).not.toBe(c);
        });
    });

    describe('Field [0-360º] (NOAA Sample)', function() {
        let dataFolder = '../../docs/data';
        let f360;

        beforeEach(function(fileLoaded2) {
            d3.text(`${dataFolder}/u_noaa.asc`, function(asc) {
                f360 = ScalarField.fromASCIIGrid(asc);
                fileLoaded2();
            });
        });

        it('supports 0-360 longitudes', function() {
            expect(f360.longitudeNeedsToBeWrapped).toBe(true);
        });

        it('returns wrapped extent', function() {
            // const original = [ -0.25, -90.25, 359.75, 90.25 ];  //wrapped, as in some NOAA products
            const expected = [-180, -90.25, 180, 90.25];
            expect(expected).toEqual(f360.extent());
        });

        it('contains points in [-180, 180] range', function() {
            expect(f360.contains(-180, 0)).toBe(true);
            expect(f360.contains(0, 0)).toBe(true);
            expect(f360.contains(180, 0)).toBe(true);
        });

        it('returns wrapped longitudes for cells', function() {
            // longitudes
            let xminCenter = f360._longitudeAtX(0);
            expect(xminCenter).toBe(0);

            let xmaxCenter = f360._longitudeAtX(719);
            expect(xmaxCenter).toBeCloseTo(-0.5, 6);

            // //
            let first = f360._lonLatAtIndexes(0, 0);
            expect(first[0]).toBe(0);
            expect(first[1]).toBe(90);

            let last = f360._lonLatAtIndexes(719, 360);
            expect(last[0]).toBe(-0.5);
            expect(last[1]).toBe(-90.0);
        });

        it('returns values & interpolated values', function() {
            // some values
            const a = -0.43;
            expect(a).toBe(f360.valueAt(0, 90)); // first value at .asc
            const b = -1.35;
            expect(b).toBe(f360.valueAt(0, -90));
            const c = 1.35;
            expect(c).toBe(f360.valueAt(-180, -90));

            // and some interpolated...
            expect(f360.interpolatedValueAt(0, 90)).not.toBe(a);
            expect(f360.interpolatedValueAt(0, -90)).not.toBe(b);
            expect(f360.interpolatedValueAt(-180, -90)).not.toBe(c);
        });
    });
});
