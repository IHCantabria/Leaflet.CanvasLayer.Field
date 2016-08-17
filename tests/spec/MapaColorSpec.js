// PRUEBAS UNITARIAS - IHCOAWST
describe("MapaColor", function () {
    describe("para Corrientes", function () {
        it("se puede obtener como función", function () {
            let f = MapaColor.paraCorrientes();

            expect(typeof f).toBe("function");

            expect(f(0).hex()).toBe('#00008f');
            expect(f(2).hex()).toBe('#8c0000');
        });

        it("se puede ajustar a un rango", function () {
            let f = MapaColor.paraCorrientes([0, 1]);
            expect(f(0).hex()).toBe('#00008f');
            expect(f(1).hex()).toBe('#8c0000');
        });
    });
});
