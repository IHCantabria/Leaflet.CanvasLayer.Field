describe("Vector", function () {
    var vector;
    beforeEach(function () {
        vector = new Vector(0.0, 0.1);
    });
    it("debería permitir recuperar sus componentes x-y", function () {
        expect(vector.u).toEqual(0.0);
        expect(vector.v).toEqual(0.1);
    });
    it("debería calcular su longitud", function () {
        expect(vector.longitud()).toEqual(0.1);
    });
    it("debería calcular su ángulo (en radianes)", function () {
        expect(vector.angulo()).toBeCloseTo(1.57, 2);
    });
    it("debería calcular su ángulo (en grados)", function () {
        expect(vector.anguloGrados()).toEqual(90.0);
    });
});
