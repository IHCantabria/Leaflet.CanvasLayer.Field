describe("CampoVectorial", function() {
    var campoVectorial;
    beforeEach(function() {
        campo = [
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ], // (x, -90)
            [
                [0, 0],
                [0, 0],
                [0.5, 0.5],
                [0, 0],
                [0, 0]
            ], // (x, 0)
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0.9, 0.9]
            ] //  (x, 90)
        ];
        campoVectorial = new CampoVectorial(-180, -90, 180, 90, 90, campo);

    });
    it("debería dar información de su extensión", function() {
        expect(campoVectorial.x0).toEqual(-180.0);
        expect(campoVectorial.y0).toEqual(-90.0);
        expect(campoVectorial.ncols()).toEqual(5);
        expect(campoVectorial.nfilas()).toEqual(3);
        expect(campoVectorial.nVectores()).toEqual(15);
    });
/*
    it("debería recuperar la fila para una latitud Y", function(){
        expect(campoVectorial.filaLat(-90)).toEqual(0);
        expect(campoVectorial.filaLat(0)).toEqual(1);
        expect(campoVectorial.filaLat(90)).toEqual(2);
    });

    it("debería recuperar la columna para una longitud X", function(){
        expect(campoVectorial.columnaLon(-180)).toEqual(0);
        expect(campoVectorial.columnaLon(-90)).toEqual(1);
        expect(campoVectorial.columnaLon(0)).toEqual(2);
        expect(campoVectorial.columnaLon(90)).toEqual(3);
        expect(campoVectorial.columnaLon(180)).toEqual(4);
    });
*/
    it("debería devolver el vector en una posición Lon-Lat", function(){
        expect(campoVectorial.UV_LonLat(-180, -90)).toEqual([0, 0]); // LL
        expect(campoVectorial.UV_LonLat(0, 0)).toEqual([0.5, 0.5]); // ecuador-greenwhich
        expect(campoVectorial.UV_LonLat(180, 90)).toEqual([0.9, 0.9]); // UR
    });
});
