// PRUEBAS UNITARIAS - IHCOAWST
describe("CampoVectorial", function () {
    var campoVectorial;
    beforeEach(function (done) {
        // Porción de datos  IHCOAWST
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

    describe("General", function () {
        it("proporciona información general sobre su extensión", function () {
            expect(campoVectorial.x0).toEqual(-3.76922975481);
            expect(campoVectorial.y0).toEqual(43.46063913285294689);
            expect(campoVectorial.x1).toEqual(-3.76468416490);
            expect(campoVectorial.y1).toEqual(43.46518472280);

            expect(campoVectorial.ncols()).toEqual(10);
            expect(campoVectorial.nfilas()).toEqual(10);

            expect(campoVectorial.nVectores()).toEqual(100);
        });

        it("permite obtener todos los componentes U & V por separado", function () {
            expect(campoVectorial.us.length).toBeGreaterThan(0);
            expect(campoVectorial.vs.length).toBeGreaterThan(0);
        });

        it("puede devolver una posición aleatoria dentro", function () {
            var pos = campoVectorial.posicionAleatoria();
            expect(pos).not.toBe(null);
            expect(campoVectorial.tieneValorEn(pos.x, pos.y)).toBe(true);
        });

        it("permite obtener la malla de base, con sus coordenadas", function () {
            var malla = campoVectorial.malla();
            console.table(malla);

            expect(malla.length).toBeGreaterThan(0);

            var lat1 = malla[0][1];
            var lat2 = malla[1][1];

            expect(lat1).toEqual(lat2);

        });
    });

    describe("Posición", function () {
        it("puede devolver el vector en una posición", function () {
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
    });

    describe("Lon-Lat", function () {
        it("puede devolver [u, v] en una Lon-Lat ", function () {
            let x0 = -3.76922975;
            let y0 = 43.46063913;
            let x1 = -3.76468416;
            let y1 = 43.46518472;

            var LL = campoVectorial.valorEn(x0, y0);
            expect(LL[0]).toBeCloseTo(0.00586759, 6);
            expect(LL[1]).toBeCloseTo(-0.003299657, 6);

            var TL = campoVectorial.valorEn(x0, y1);
            expect(TL[0]).toBeCloseTo(0.01127530003, 6);
            expect(TL[1]).toBeCloseTo(-0.0035406511, 6);

            var TR = campoVectorial.valorEn(x1, y1);
            expect(TR[0]).toBeCloseTo(0.215019, 6);
            expect(TR[1]).toBeCloseTo(-0.00158082, 6);

            var LR = campoVectorial.valorEn(x1, y0);
            expect(LR[0]).toBeCloseTo(0.14851, 6);
            expect(LR[1]).toBeCloseTo(-0.0152797, 6);
        });

        it("puede devolver el {Vector} en una Lon-Lat", function () {
            let x0 = -3.76922975;
            let y0 = 43.46063913;
            let x1 = -3.76468416;
            let y1 = 43.46518472;

            // LL
            var uv = campoVectorial.vectorEn(x0, y0);
            expect(uv).toEqual(new Vector(0.00586759, -0.00329966));

            // UR
            uv = campoVectorial.vectorEn(x1, y1);
            expect(uv).toEqual(new Vector(0.2150189, -0.00158082));

            // out...
            uv = campoVectorial.vectorEn(-360, -180);
            expect(uv).toEqual(null);
        });

        it("permite saber si hay valor de vector en una Lon-Lat", function () {

            let x0 = -3.76922975;
            let y0 = 43.46063913;
            expect(campoVectorial.tieneValorEn(x0, y0)).toBe(true);
            expect(campoVectorial.tieneValorEn(-360, -180)).toBe(false);

            //para grid // expect(campoVectorial.tieneValorEn(-3.819427007621642, 43.47742891281832)).toBe(false);
        });

        it("no da valor para una Lon-Lat fuera de la malla", function () {
            let x = -3.710591474014617;
            let y = 43.47082043045964;
            expect(campoVectorial.tieneValorEn(x, y)).toBe(false);
        });
    });

});
