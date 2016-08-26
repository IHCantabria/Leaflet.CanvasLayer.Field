describe("ColorMap", function () {
    describe("for Currents", function () {
        it("has associated data", function () {
            let m = ColorMap.forCurrents();
            expect(m.scale).not.toBe(null);
            expect(typeof m.scale).toBe("function");

            expect(m.domain).not.toBe(null);
            expect(m.units).not.toBe(null);
        });

        it("has a default chroma function", function () {
            let m = ColorMap.forCurrents();

            let f = m.scale;
            let c0 = f(0).hex();
            let c2 = f(2).hex();
            expect(c0).not.toBe('');
            expect(c2).not.toBe('');
            expect(c0).not.toBe(c2);
        });

        it("can be used with a different data domain", function () {
            let m = ColorMap.forCurrents([0, 1]);
            let c0 = m.scale(0).hex();
            let c1 = m.scale(1).hex();
            let c2 = m.scale(2).hex();
            let c100 = m.scale(100).hex();

            expect(c0).not.toBe('');
            expect(c1).not.toBe('');

            expect(c1 === c2 && c2 === c100).toBe(true); // same color for 'above'
        });
    });
});
