// PRUEBAS UNITARIAS - IHCOAWST
describe("MapaColor", function () {
    describe("para Corrientes", function () {
        it("tiene datos generales", function () {
            let m = MapaColor.paraCorrientes();
            // funcion de escala
            expect(m.escala).not.toBe(null);
            expect(typeof m.escala).toBe("function");

            // otros datos...
            expect(m.dominio).not.toBe(null);
            expect(m.unidades).not.toBe(null);
        });

        it("se puede usar su función por defecto generadora de colores", function () {
            let m = MapaColor.paraCorrientes();

            let f = m.escala;
            let c0 = f(0).hex();
            let c2 = f(2).hex();
            expect(c0).not.toBe('');
            expect(c2).not.toBe('');
            expect(c0).not.toBe(c2);
        });


        it("se puede ajustar su función a un rango", function () {
            let m = MapaColor.paraCorrientes([0, 1]);
            let c0 = m.escala(0).hex();
            let c1 = m.escala(1).hex();
            let c2 = m.escala(2).hex();
            let c100 = m.escala(100).hex();

            expect(c0).not.toBe('');
            expect(c1).not.toBe('');

            expect(c1 === c2 && c2 === c100).toBe(true); // el color es el mismo fuera del dominio...
        });
    });
});
