describe("CampoVectorial", function () {
    var campoVectorial;
    beforeEach(function () {
        componenteU = [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0.9];
        componenteV = [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0.9];

        campoVectorial = new CampoVectorial(-180, -90, 180, 90, 90);
        campoVectorial.componenteU = componenteU;
        campoVectorial.componenteV = componenteV;

    });

    it("debería dar información general sobre su extensión", function () {
        expect(campoVectorial.x0).toEqual(-180.0);
        expect(campoVectorial.y0).toEqual(-90.0);
        expect(campoVectorial.ncols()).toEqual(5);
        expect(campoVectorial.nfilas()).toEqual(3);
        expect(campoVectorial.nVectores()).toEqual(15);
    });

    it("permite obtener todos los componentes U & V", function () {
        expect(campoVectorial.componenteU.length).toBeGreaterThan(0);
        expect(campoVectorial.componenteV.length).toBeGreaterThan(0);
    });

    it("debería devolver el vector en una posición", function () {
        expect(campoVectorial.nVectores()).toEqual(15);
        expect(campoVectorial.vector(0)).toEqual([0, 0]);
        expect(campoVectorial.vector(14)).toEqual([0.9, 0.9]);
    });

    it("debería conocer la Lon-Lat de posición", function () {
        expect(campoVectorial.lonLatEnIndice(0)).toEqual([-180, -90]);
        expect(campoVectorial.lonLatEnIndice(14)).toEqual([180, 90]);
    });

    it("debería devolver los valores [u, v] del vector en una Lon-Lat", function () {
        expect(campoVectorial.valorEn(-180, -90)).toEqual([0, 0]); // LL
        expect(campoVectorial.valorEn(0, 0)).toEqual([0.5, 0.5]); // ecuador-greenwhich
        expect(campoVectorial.valorEn(180, 90)).toEqual([0.9, 0.9]); // UR

        expect(campoVectorial.valorEn(-360, -180)).toEqual(null);
    });

    it("debería devolver el {Vector} en una Lon-Lat", function () {
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

    it("debería permitir saber si una posición tiene valor", function () {
        expect(campoVectorial.tieneValorEn(0, 0)).toBe(true);
        expect(campoVectorial.tieneValorEn(-1, -1)).toBe(false);
        expect(campoVectorial.tieneValorEn(-179, -89)).toBe(false);
    });

    it("debería poder devolver una posición aleatoria dentro", function () {
        var pos = campoVectorial.posicionAleatoria();
        expect(pos).not.toBe(null);
        expect(campoVectorial.tieneValorEn(pos.x, pos.y)).toBe(true);
    });
});
