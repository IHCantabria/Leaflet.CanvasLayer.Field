describe('Field', function () {
    let Field = L.Field;
    let ScalarField = L.ScalarField;

    let dataFolder = '../../docs/data';
    let f;

    beforeEach(function (fileLoaded) {
        d3.text(`${dataFolder}/U.asc`, function (asc) {
            f = ScalarField.fromASCIIGrid(asc);
            fileLoaded();
        });
    });

    it('gives general info about its cells and extent', function () {
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

        expect(f.cellSize).toEqual(0.000505065545);
        expect(f.numCells()).toEqual(100);
    });

    it('is a regular grid with nCols & nRows', function () {
        expect(f.grid).not.toBe(null);

        let i = f.grid.length;
        let j = f.grid[0].length;
        expect(i).toBe(f.nRows);
        expect(j).toBe(f.nCols);
    });

    it('can generate a random position inside', function () {
        let pos = f.randomPosition();
        expect(pos).not.toBe(null);
        expect(f.contains(pos.x, pos.y)).toBe(true);

        let pos2 = f.randomPosition();
        expect(pos2).not.toBe(pos);
    });

    it('knows the longitude & latitude for each cell', function () {
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

    it('does\'nt return a value for a lon-lat outside of the grid ', function () {
        let lon = -3.710591474014617;
        let lat = 43.47082043045964;
        expect(f.hasValueAt(lon, lat)).toBe(false);
    });

    it('can return its pyramids (max)', function () {
        let ps = f.getPyramidLevels();
        expect(ps.length).toBe(4);

        expect(ps[0]).toBe(1);
        expect(ps[1]).toBe(2);
    });

});
