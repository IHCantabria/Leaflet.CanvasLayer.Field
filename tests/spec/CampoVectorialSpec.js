// PRUEBAS UNITARIAS - IHCOAWST
describe("CampoVectorial", function () {
    var cv;
    beforeEach(function (done) {
        // Porción de datos  IHCOAWST
        d3.json("../../data/porcion.json", function (d) {
            let params = {
                "ncols": d.ncols,
                "nrows": d.nrows,
                "xllcorner": d.xllcorner,
                "yllcorner": d.yllcorner,
                "dx": d.dx,
                "dy": d.dy,
                "us": d.us,
                "vs": d.vs
            };

            cv = new CampoVectorial(params);
            done();
        });
    });

    describe("General", function () {
        it("proporciona información general sobre su extensión", function () {
            expect(cv.ncols).toEqual(10);
            expect(cv.nrows).toEqual(10);

            expect(cv.xllcorner).toEqual(-3.769470033164);
            expect(cv.yllcorner).toEqual(43.460341898838);

            expect(cv.xurcorner).toBeCloseTo(-3.7644193777140003, 8);
            expect(cv.yurcorner).toBeCloseTo(43.4653925542880017, 8);

            expect(cv.numeroCeldas()).toEqual(100);
        });

        it("tiene los datos organizados como malla (filas x columnas)", function () {
            var i = cv.malla.length;
            var j = cv.malla[0].length;
            expect(i).toBe(cv.nrows);
            expect(j).toBe(cv.ncols);
        });

        it("puede devolver una posición aleatoria dentro", function () {
            var pos = cv.posicionAleatoria();
            expect(pos).not.toBe(null);
            expect(cv.contiene(pos.x, pos.y)).toBe(true);
        });


    });

    describe("Posición", function () {
        it("puede devolver los valores del vector en un (i,j) de la malla", function () {
            // top-left
            expect(cv.vector(0, 0)).toEqual([0.011275325901806355, -0.003540651174262166]);

            // botton-right
            expect(cv.vector(9, 9)).toEqual([0.14851005375385284, -0.015279672108590603]);
        });

        it("debe conocer cada Lon-Lat de una posición", function () {
            throw Error('en proceso...');
            /*
            let xmin = cv.longitudIndiceX(0);
            let ymin = cv.latitudIndiceY(9);
            let xmax = cv.longitudIndiceX(9);
            let ymax = cv.latitudIndiceY(0);

            var primero = cv.lonLatEnIndice(0, 0);
            expect(primero[0]).toBeCloseTo(cv.xllcorner, 7);
            expect(primero[1]).toBeCloseTo(cv.yurcorner, 7);

            var ultimo = cv.lonLatEnIndice(9, 9);
            expect(ultimo[0]).toBeCloseTo(cv.xurcorner, 7);
            expect(ultimo[1]).toBeCloseTo(cv.yllcorner, 7);
            */
        });
    });

    describe("Lon-Lat", function () {
        it("puede devolver [u, v] en una Lon-Lat ", function () {
            let x0 = -3.76922975;
            let y0 = 43.46063913;
            let x1 = -3.76468416;
            let y1 = 43.46518472;

            var LL = cv.valorEn(x0, y0);
            expect(LL[0]).toBeCloseTo(0.00586759, 6);
            expect(LL[1]).toBeCloseTo(-0.003299657, 6);

            var TL = cv.valorEn(x0, y1);
            expect(TL[0]).toBeCloseTo(0.01127530003, 6);
            expect(TL[1]).toBeCloseTo(-0.0035406511, 6);

            var TR = cv.valorEn(x1, y1);
            expect(TR[0]).toBeCloseTo(0.215019, 6);
            expect(TR[1]).toBeCloseTo(-0.00158082, 6);

            var LR = cv.valorEn(x1, y0);
            expect(LR[0]).toBeCloseTo(0.14851, 6);
            expect(LR[1]).toBeCloseTo(-0.0152797, 6);
        });

        it("puede devolver el {Vector} en una Lon-Lat", function () {
            let x0 = -3.76922975;
            let y0 = 43.46063913;
            let x1 = -3.76468416;
            let y1 = 43.46518472;

            // LL
            var uv = cv.vectorEn(x0, y0);
            expect(uv).toEqual(new Vector(0.00586759, -0.00329966));

            // UR
            uv = cv.vectorEn(x1, y1);
            expect(uv).toEqual(new Vector(0.2150189, -0.00158082));

            // out...
            uv = cv.vectorEn(-360, -180);
            expect(uv).toEqual(null);
        });

        it("permite saber si hay valor de vector en una Lon-Lat", function () {

            let x0 = -3.76922975;
            let y0 = 43.46063913;
            expect(cv.tieneValorEn(x0, y0)).toBe(true);
            expect(cv.tieneValorEn(-360, -180)).toBe(false);

            //para grid // expect(cv.tieneValorEn(-3.819427007621642, 43.47742891281832)).toBe(false);
        });

        it("no da valor para una Lon-Lat fuera de la malla", function () {
            let x = -3.710591474014617;
            let y = 43.47082043045964;
            expect(cv.tieneValorEn(x, y)).toBe(false);
        });
    });

});
