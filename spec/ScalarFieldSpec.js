describe("ScalarField", function () {
  let ScalarField = L.ScalarField;
  let Cell = L.Cell;

  let dataFolder = "base/docs/data";

  describe("ASCII Grid format", function () {
    let sf;

    beforeEach(function (fileLoaded) {
      d3.text(`${dataFolder}/U.asc`, function (z) {
        sf = ScalarField.fromASCIIGrid(z);
        fileLoaded();
      });
    });

    it("can be created from an ASCIIGrid file", function () {
      expect(sf).not.toBe(null);
    });

    it("understand header with XLLCORNER - YLLCORNER corner", function () {
      var fileHeaderLines = [
        "ncols        10",
        "nrows        10",
        "xllcorner    -3.00",
        "yllcorner    43.00",
        "cellsize     0.50",
        "NODATA_value  -9999.0",
      ];
      var header = ScalarField._parseASCIIGridHeader(fileHeaderLines);
      expect(header).toEqual({
        nCols: 10,
        nRows: 10,
        xllCorner: -3.0,
        yllCorner: 43.0,
        cellXSize: 0.5,
        cellYSize: 0.5,
        noDataValue: -9999.0,
      });
    });

    it("understand header with XLLCENTER - YLLCENTER corner", function () {
      var fileHeaderLines = [
        "ncols        10",
        "nrows        10",
        "xllcenter    -2.50",
        "yllcenter    43.50",
        "cellsize     0.50",
        "NODATA_value  -9999.0",
      ];
      var header = ScalarField._parseASCIIGridHeader(fileHeaderLines);
      expect(header).toEqual({
        nCols: 10,
        nRows: 10,
        xllCorner: -2.75,
        yllCorner: 43.25,
        cellXSize: 0.5,
        cellYSize: 0.5,
        noDataValue: -9999.0,
      });
    });

    it("can return the value for (i, j) indexes", function () {
      // top-left
      expect(sf._valueAtIndexes(0, 0)).toEqual(0.011275325901806355);

      // botton-right
      expect(sf._valueAtIndexes(9, 9)).toEqual(0.14851005375385284);
    });

    it("can return the value for a (lon, lat)", function () {
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

    it("can return its cells", function () {
      let grid = sf.getCells();
      let p0 = grid[0];
      let pN = grid[grid.length - 1];

      expect(p0).not.toBe(null);
      expect(pN).not.toBe(null);
    });

    it("can calculate the Range of its values", function () {
      expect(sf.range).not.toBe(null);
      expect(sf.range[0]).toBeCloseTo(0.0058675920590758, 8);
      expect(sf.range[1]).toBeCloseTo(0.21501889824867, 8);
    });

    it("can be filtered", function () {
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

  describe("Geotiff: single raster", function () {
    let sf;

    beforeEach(function (fileLoaded) {
      d3.request(`${dataFolder}/tz850.tiff`)
        .responseType("arraybuffer")
        .get(function (error, tiffData) {
          sf = ScalarField.fromGeoTIFF(tiffData.response, 0);
          fileLoaded();
        });
    });

    it("can be created from one band", function () {
      expect(sf).not.toBe(null);
    });
  });

  describe("Geotiff: multiple raster, one from each band", function () {
    let multipleSf;

    beforeEach(function (fileLoaded) {
      d3.request(`${dataFolder}/tz850.tiff`)
        .responseType("arraybuffer")
        .get(function (error, tiffData) {
          multipleSf = ScalarField.multipleFromGeoTIFF(tiffData.response, [
            0,
            1,
          ]);
          fileLoaded();
        });
    });

    it("array can be created from several bands in file", function () {
      expect(multipleSf.length).toBe(2);
    });
  });
});
