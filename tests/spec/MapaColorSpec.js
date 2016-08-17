// PRUEBAS UNITARIAS - IHCOAWST
describe("MapaColor", function () {
    describe("para Corrientes", function () {
        it("tiene datos generales", function () {
            let f = MapaColor.paraCorrientes();
            expect(typeof f).toBe("function");

            let c0 = f(0).hex();
            let c2 = f(2).hex();
            expect(c0).not.toBe('');
            expect(c2).not.toBe('');
            expect(c0).not.toBe(c2);
        });

        it("se puede usar su función por defecto", function () {
            let m = MapaColor.paraCorrientes();
            let c0 = f(0).hex();
            let c2 = f(2).hex();
            expect(c0).not.toBe('');
            expect(c2).not.toBe('');
            expect(c0).not.toBe(c2);
        });


        it("se puede ajustar su función a un rango", function () {
            let f = MapaColor.paraCorrientes([0, 1]);

            let c0 = f(0).hex();
            let c2 = f(2).hex();

            expect(c0).not.toBe('');
            expect(c2).toBe(null);
        });
    });
});
