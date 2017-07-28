describe('L.ColorScale', function () {

    it('builds full color definition', function(){
        var def = L.ColorScale.buildFullDefinition(["#ffffff", "#000000"]);
        expect(def.colors).toEqual(["#ffffff", "#000000"]);
        expect(def.positions).toEqual([0, 1]);

        def = L.ColorScale.buildFullDefinition(["#ffffff", "#ffcc00", "#000000"]);
        expect(def.colors).toEqual(["#ffffff", "#ffcc00", "#000000"]);
        expect(def.positions).toEqual([0, 0.5, 1]);

    });

    it('from simplest definition', function () {
        var def = ["red", "blue"];
        var cs = new L.ColorScale(def);

        expect(cs).not.toBe(null);
    });

    it('from simplest definition (hex colors)', function () {
        var def = ["#ffffff", "#000000"];
        var cs = new L.ColorScale(def);

        expect(cs).not.toBe(null);
        expect(cs.options.domain).toEqual([0, 1]);

        // 0 --> black
        let rgba = cs.colorFor(0);
        expectRgbIsAlmostEqualTo(rgba, '#FFFFFF');

        // 1 --> white
        rgba = cs.colorFor(1);
        expectRgbIsAlmostEqualTo(rgba, '#000000');

        // 0.5 --> gray
        rgba = cs.colorFor(0.5);
        expectRgbIsAlmostEqualTo(rgba, '#808080');
    });

    it('from name ("e.g. greys")', function () {
        var cs = L.ColorScale.get('greys');

        expect(cs).not.toBe(null);
        expect(cs.options.domain).toEqual([0, 1]);

        // 0 --> black
        let rgba = cs.colorFor(0);
        expectRgbIsAlmostEqualTo(rgba, '#000000');

        // 1 --> white
        rgba = cs.colorFor(1);
        expectRgbIsAlmostEqualTo(rgba, '#ffffff');

        // 0.5 --> grey
        rgba = cs.colorFor(0.5);
        expectRgbIsAlmostEqualTo(rgba, '#808080');
    });


//    it('allows to flip colorScale colors', function () {
//        var cs = L.ColorScale.get('greys').flip();
//
//        expect(cs).not.toBe(null);
//        expect(cs.domain).toEqual([0, 1]);
//
//        // 0, not black, but white
//        let rgba = cs.colorFor(0);
//        expectRgbIsAlmostEqualTo('#FFFFFF');
//
//        // 1, not white, but black
//        rgba = cs.colorFor(1);
//        expectRgbIsAlmostEqualTo('#000000');
//
//        // 0.5 --> grey, same
//        rgba = cs.colorFor(0.5);
//        expectRgbIsAlmostEqualTo('#808080');
//    });

    function expectRgbIsAlmostEqualTo(rgba, hex) {
        let R = rgba[0],
            G = rgba[1],
            B = rgba[2];

        let expected = L.ColorScale.hexToRgb(hex);
        // gradient doesn't provide exact values
        const tolerance = 2;
        expect(Math.abs(R - expected[0])).toBeLessThan(tolerance);
        expect(Math.abs(G - expected[1])).toBeLessThan(tolerance);
        expect(Math.abs(B - expected[2])).toBeLessThan(tolerance);
    }
});
