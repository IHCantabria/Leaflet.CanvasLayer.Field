describe("Vector", function () {

    it("returns u & v values", function () {
        let vector = new Vector(0.0, 0.1);
        expect(vector.u).toEqual(0.0);
        expect(vector.v).toEqual(0.1);
    });

    it("calculates its magnitude", function () {
        let vector = new Vector(0.0, 0.1);
        expect(vector.magnitude()).toEqual(0.1);

        // upper-right corner @ test.json
        let v = new Vector(0.215018898248672, -0.00158081843983382);
        expect(v.magnitude()).toBeCloseTo(0.215025, 6);
    });

    it("calculates its direction (radians)", function () {
        let vector = new Vector(0.0, 0.1);
        expect(vector.direction()).toBeCloseTo(1.57, 2);
    });

    it("calculates its direction (degrees)", function () {
        let vector = new Vector(0.0, 0.1);
        expect(vector.directionDeg()).toEqual(90.0);

        let vector2 = new Vector(-0.2975063419766429, -0.026444888334430344);
        expect(vector2.directionDeg()).not.toBeCloseTo(-174.92, 2); // TODO
        // http://stackoverflow.com/questions/1311049/how-to-map-atan2-to-degrees-0-360
    });
    /*





    */
});
