describe("Vector", function () {
    var vector;

    beforeEach(function () {
        vector = new Vector(0.0, 0.1);
    });

    it("returns u & v values", function () {
        expect(vector.u).toEqual(0.0);
        expect(vector.v).toEqual(0.1);
    });

    it("calculates its magnitude", function () {
        expect(vector.magnitude()).toEqual(0.1);

        // upper-right corner @ test.json
        let v = new Vector(0.215018898248672, -0.00158081843983382);
        expect(v.magnitude()).toBeCloseTo(0.215025, 6);
    });

    it("calculates its direction (radians)", function () {
        expect(vector.direction()).toBeCloseTo(1.57, 2);
    });

    it("calculates its direction (degrees)", function () {
        expect(vector.directionDeg()).toEqual(90.0);
    });

});
