describe("CampoVectorial", function() {
    var campo;
    beforeEach(function() {
        vectores = [
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
        campo = new CampoVectorial(-180, -90, 180, 90, 90, vectores);

    });
    it("debería dar información de su extensión", function() {
        expect(campo.x0).toEqual(-180.0);
        expect(campo.y0).toEqual(-90.0);
        expect(campo.ncols()).toEqual(5);
        expect(campo.nfilas()).toEqual(3);
        expect(campo.nVectores()).toEqual(15);
    });

    it("debería recuperar la fila para una latitud Y", function(){
        expect(campo.filaLat(-90)).toEqual(0);
        expect(campo.filaLat(0)).toEqual(1);
        expect(campo.filaLat(90)).toEqual(2);
    });

    it("debería recuperar la columna para una longitud X", function(){
        expect(campo.columnaLon(-180)).toEqual(0);
        expect(campo.columnaLon(-90)).toEqual(1);
        expect(campo.columnaLon(0)).toEqual(2);
        expect(campo.columnaLon(90)).toEqual(3);
        expect(campo.columnaLon(180)).toEqual(4);
    });

    it("debería devolver el vector en una posición Lon-Lat", function(){
        expect(campo.UV_LonLat(-180, -90)).toEqual([0, 0]); // LL
        expect(campo.UV_LonLat(0, 0)).toEqual([0.5, 0.5]); // ecuador-greenwhich
        expect(campo.UV_LonLat(180, 90)).toEqual([0.9, 0.9]); // UR
    });
});
