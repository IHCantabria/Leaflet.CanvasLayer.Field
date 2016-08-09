// PRUEBAS UNITARIAS
/*describe("CampoVectorial", function () {
    var campoVectorial;
    beforeEach(function () {
        us = [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0.9];
        vs = [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0.9];

        let params = {
            "encuadre": [-180, -90, 180, 90],
            "dx": 90,
            "dy": 90,
            "us": us,
            "vs": vs
        };

        campoVectorial = new CampoVectorial(params);
    });

    it("proporciona información general sobre su extensión", function () {
        expect(campoVectorial.x0).toEqual(-180.0);
        expect(campoVectorial.y0).toEqual(-90.0);
        expect(campoVectorial.ncols()).toEqual(5);
        expect(campoVectorial.nfilas()).toEqual(3);
        expect(campoVectorial.nVectores()).toEqual(15);
    });

    it("permite obtener todos los componentes U & V por separado", function () {
        expect(campoVectorial.us.length).toBeGreaterThan(0);
        expect(campoVectorial.vs.length).toBeGreaterThan(0);
    });

    it("puede devolver el vector en una posición concreta", function () {
        expect(campoVectorial.nVectores()).toEqual(15);
        expect(campoVectorial.vector(0)).toEqual([0, 0]);
        expect(campoVectorial.vector(14)).toEqual([0.9, 0.9]);
    });

    it("conocer cada Lon-Lat de una posición", function () {
        expect(campoVectorial.lonLatEnIndice(0)).toEqual([-180, -90]);
        expect(campoVectorial.lonLatEnIndice(14)).toEqual([180, 90]);
    });

    it("puede devolver los valores [u, v] del vector en una Lon-Lat", function () {
        expect(campoVectorial.valorEn(-180, -90)).toEqual([0, 0]); // LL
        expect(campoVectorial.valorEn(0, 0)).toEqual([0.5, 0.5]); // ecuador-greenwhich
        expect(campoVectorial.valorEn(180, 90)).toEqual([0.9, 0.9]); // UR

        expect(campoVectorial.valorEn(-360, -180)).toEqual(null);
    });

    it("puede devolver el {Vector} en una Lon-Lat", function () {
        // LL
        var uv = campoVectorial.vectorEn(-180, -90);
        expect(uv).toEqual(new Vector(0, 0));

        // ecuador-greenwhich
        uv = campoVectorial.vectorEn(0, 0);
        expect(uv).toEqual(new Vector(0.5, 0.5));

        // UR
        uv = campoVectorial.vectorEn(180, 90);
        expect(uv).toEqual(new Vector(0.9, 0.9));

        // out...
        uv = campoVectorial.vectorEn(-360, -180);
        expect(uv).toEqual(null);
    });

    it("permite saber si una posición tiene valor", function () {
        expect(campoVectorial.tieneValorEn(0, 0)).toBe(true);
        expect(campoVectorial.tieneValorEn(-360, -180)).toBe(false);
    });

    it("puede devolver una posición aleatoria dentro", function () {
        var pos = campoVectorial.posicionAleatoria();
        expect(pos).not.toBe(null);
        expect(campoVectorial.tieneValorEn(pos.x, pos.y)).toBe(true);
    });

    it("permite obtener la malla de base, con sus coordenadas", function () {
        var malla = campoVectorial.malla();
        expect(malla.length).toBeGreaterThan(0);
    });
});

*/


// PRUEBAS INTEGRACION --------------------------------------
describe("CampoVectorial - IHCOAWST", function () {
    var campoVectorial;
    beforeEach(function (done) {
        d3.json("../../data/porcion.json", function (d) {
            let params = {
                "x0": d.x0,
                "y0": d.y0,
                "x1": d.x1,
                "y1": d.y1,
                "dx": d.dx,
                "dy": d.dy,
                "us": d.us,
                "vs": d.vs
            };

            campoVectorial = new CampoVectorial(params);
            done();
        });
    });

    it("proporciona información general sobre su extensión", function () {
        expect(campoVectorial.x0).toEqual(-3.76922975481);
        expect(campoVectorial.y0).toEqual(43.46063913285294689);
        expect(campoVectorial.x1).toEqual(-3.76468416490);
        expect(campoVectorial.y1).toEqual(43.46518472280);

        expect(campoVectorial.ncols()).toEqual(10);
        expect(campoVectorial.nfilas()).toEqual(10);

        expect(campoVectorial.nVectores()).toEqual(100);
    });

    it("puede devolver el vector en una posición concreta", function () {
        // top-left
        expect(campoVectorial.vector(0)).toEqual([0.011275325901806355, -0.003540651174262166]);

        // botton-right
        expect(campoVectorial.vector(99)).toEqual([0.14851005375385284, -0.015279672108590603]);
    });

    it("debe conocer cada Lon-Lat de una posición", function () {
        let x0 = -3.76922975;
        let y0 = 43.46063913;
        let x1 = -3.76468416;
        let y1 = 43.46518472;

        var primero = campoVectorial.lonLatEnIndice(0);
        expect(primero[0]).toBeCloseTo(x0, 7);
        expect(primero[1]).toBeCloseTo(y1, 7);

        var ultimo = campoVectorial.lonLatEnIndice(99);
        expect(ultimo[0]).toBeCloseTo(x1, 7);
        expect(ultimo[1]).toBeCloseTo(y0, 7);
    });

    it("puede devolver los valores [u, v] del vector en una Lon-Lat", function () {
        let x0 = -3.76922975;
        let y0 = 43.46063913;
        let x1 = -3.76468416;
        let y1 = 43.46518472;

        var valores = campoVectorial.valorEn(x0, y0); //LL
        expect(valores[0]).toBeCloseTo(0.00586759, 7); // almostEqual, 7 dec.
        expect(valores[1]).toBeCloseTo(-0.003299657, 7); // almostEqual, 7 dec.
        //
        //expect(campoVectorial.valorEn(-360, -180)).toEqual(null);
    });
    /*
        it("puede devolver el {Vector} en una Lon-Lat", function () {
            // LL
            var uv = campoVectorial.vectorEn(-180, -90);
            expect(uv).toEqual(new Vector(0, 0));

            // ecuador-greenwhich
            uv = campoVectorial.vectorEn(0, 0);
            expect(uv).toEqual(new Vector(0.5, 0.5));

            // UR
            uv = campoVectorial.vectorEn(180, 90);
            expect(uv).toEqual(new Vector(0.9, 0.9));

            // out...
            uv = campoVectorial.vectorEn(-360, -180);
            expect(uv).toEqual(null);
        });
    */
    /*
        it("recupera ok datos reales", function () {
            // esquina superior izquierda
            var vector = campoVectorial.vectorEn(-3.769182, 43.465161);
            var esperado = {
                u: 0.0112753259018064,
                v: -0.00354065117426217
            };
            expect(vector).toBe(esperado);
        });
    */
});
