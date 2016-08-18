// PRUEBAS UNITARIAS - IHCOAWST
describe("CampoVectorial", function () {
    var cv;
    beforeEach(function (done) {
        // Porción de datos  IHCOAWST
        d3.json("../../data/porcion.json", function (d) {
            cv = CampoVectorial.desdeJson(d);
            done();
        });
    });

    describe("General", function () {
        it("proporciona información general sobre su extensión", function () {
            expect(cv.ncols).toEqual(10);
            expect(cv.nrows).toEqual(10);

            let xmin = -3.769470033164;
            let ymin = 43.460341898838;
            let xmax = -3.764419377714;
            let ymax = 43.465392554288;

            expect(cv.xllcorner).toEqual(xmin);
            expect(cv.yllcorner).toEqual(ymin);
            expect(cv.xurcorner).toBeCloseTo(xmax, 8);
            expect(cv.yurcorner).toBeCloseTo(ymax, 8);

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

        it("puede leer rango de magnitudes", function () {
            var rango = cv.rangoMagnitud();
            expect(rango).not.toBe(null);
        });
    });

    describe("Posición", function () {
        it("puede devolver los valores del vector en un (i,j) de la malla", function () {
            // top-left
            expect(cv.vector(0, 0)).toEqual([0.011275325901806355, -0.003540651174262166]);

            // botton-right
            expect(cv.vector(9, 9)).toEqual([0.14851005375385284, -0.015279672108590603]);
        });

        it("debe conocer cada Lon-Lat de una celda", function () {

            // longitudes de celda
            let xminCenter = cv.longitudIndiceX(0);
            expect(xminCenter).toBeCloseTo(-3.7692175003915001, 6);

            let xmaxCenter = cv.longitudIndiceX(9);
            expect(xmaxCenter).toBeCloseTo(-3.7646719104865003, 6);

            // latitudes de celda
            let ymaxCenter = cv.latitudIndiceY(0);
            expect(ymaxCenter).toBeCloseTo(43.465140021515502, 6);

            let yminCenter = cv.latitudIndiceY(9);
            expect(yminCenter).toBeCloseTo(43.460594431610502, 6);

            //
            var primero = cv.lonLatEnIndices(0, 0);
            expect(primero[0]).toBeCloseTo(-3.7692175003915001, 7);
            expect(primero[1]).toBeCloseTo(43.465140021515502, 7);

            var ultimo = cv.lonLatEnIndices(9, 9);
            expect(ultimo[0]).toBeCloseTo(-3.7646719104865003, 7);
            expect(ultimo[1]).toBeCloseTo(43.460594431610502, 7);


            // otro... 
            var pto = cv.lonLatEnIndices(0, 8);
            expect(pto[0]).toBeCloseTo(-3.7692175001640003, 7);
            expect(pto[1]).toBeCloseTo(43.461099497838006, 7);
        });
    });

    describe("Lon-Lat", function () {

        it("no da valor para una Lon-Lat fuera de la malla", function () {
            let x = -3.710591474014617;
            let y = 43.47082043045964;
            expect(cv.tieneValorEn(x, y)).toBe(false);
        });

        it("puede devolver [u, v] en una Lon-Lat ", function () {
            // muy cerca del pto. central de la celda LL (arriba a su derecha)
            var ptoCercaLL = cv.valorEn(-3.76921724303, 43.4605948227);
            expect(ptoCercaLL[0]).toBeCloseTo(0.00586759205907583, 4);
            expect(ptoCercaLL[1]).toBeCloseTo(-0.00329965655691922, 4);

            // muy cerca del pto. central de la celda UL (abajo a su derecha)
            var ptoCercaUL = cv.valorEn(-3.76921740247, 43.4651398993);
            expect(ptoCercaUL[0]).toBeCloseTo(0.01127532590180643, 4);
            expect(ptoCercaUL[1]).toBeCloseTo(-0.00354065117426217, 4);

            // muy cerca del pto. central de la celda UR (abajo a su izquierda)
            var ptoCercaUR = cv.valorEn(-3.76467191838, 43.4651400146);
            expect(ptoCercaUR[0]).toBeCloseTo(0.215018898248672, 4);
            expect(ptoCercaUR[1]).toBeCloseTo(-0.00158081843983382, 4);

            // muy cerca del pto. central de la celda LR (arriba a su izquierda)
            var ptoCercaLR = cv.valorEn(-3.76467191746, 43.4605944395);
            expect(ptoCercaLR[0]).toBeCloseTo(0.148510053753853, 4);
            expect(ptoCercaLR[1]).toBeCloseTo(-0.0152796721085906, 4);
        });

        /*
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


        */
    });

});
