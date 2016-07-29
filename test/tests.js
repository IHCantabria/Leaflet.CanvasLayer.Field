/**
    Malla mundo, con datos cada 45º
*/
"use strict";
var datosMundo90 = {
    x0: -180.0, // xmin
    y0: -90.0, // ymin
    x1: 180.0, // xmax
    y1: 90.0, // ymax
    dx: 90.0, // incremento en x
    dy: 90.0, // incremento en y
    ncols() {
        return (this.x1 - this.x0) / this.dx + 1;
    },
    nfilas() {
        return (this.y1 - this.y0) / this.dy + 1;
    },
    nVectores() {
        return this.ncols() * this.nfilas();
    },
    /**
     * Valor para longitud-latitud
     * @param   {[[Type]]} lon [[Description]]
     * @param   {[[Type]]} lat [[Description]]
     * @returns {Array}    [[Description]]
     */
    UV_LonLat(lon, lat) {
        var x = this.filaLat(lat);
        var y = this.columnaLon(lon);
        return this.campo[x][y];
    },
    /**
     * Índice de fila para Latitud, desde 0
     * @param   {float} lat Latitud EPSG:4326
     * @returns {integer} Índice de fila donde buscar el valor de campo
     */
    filaLat(lat) {
        var indiceX = (lat - this.y0) / this.dy;
        return indiceX;
    },

    /**
     * Índice de columna para Longitud, desde 0
     * @param   {float} lon Longitud EPSG:4326
     * @returns {integer} Índice de columna donde buscar el valor de campo
     */
    columnaLon(lon) {
        var indiceY = (lon - this.x0) / this.dx;
        return indiceY;
    },
    /*
        ascendente-x, una fila por latitud
        [0, 0] --> coords (-180,-90)
        [0, 1] --> coords (-90,-90)
        [0, 2] --> coords (0,-90)
        ...
    */
    campo: [
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], // (x, -90)
        [[0, 0], [0, 0], [0.5, 0.5], [0, 0], [0, 0]], // (x, 0)
        [[0, 0], [0, 0], [0, 0], [0, 0], [0.9, 0.9]] //  (x, 90)
    ]
};


// Datos vectoriales
QUnit.test("datos - filas y columnas", function (assert) {
    var datos = datosMundo90;
    assert.ok(datos.x0 === -180.0, "x0");
    assert.ok(datos.y0 === -90.0, "y0");
    assert.equal(datos.ncols(), 5, "columnas");
    assert.equal(datos.nfilas(), 3, "filas");
    assert.equal(datos.nVectores(), 15, "n vectores");
});

QUnit.test("datos - índice fila latitud Y", function (assert) {
    var datos = datosMundo90;
    assert.equal(datos.filaLat(-90), 0, "fila para latitud -90");
    assert.equal(datos.filaLat(0), 1, "fila para latitud 0");
    assert.equal(datos.filaLat(90), 2, "fila para latitud 90");
});

QUnit.test("datos - índice columna longitud X", function (assert) {
    var datos = datosMundo90;
    assert.equal(datos.columnaLon(-180), 0, "columna para longitud -180");
    assert.equal(datos.columnaLon(-90), 1, "columna para longitud -90");
    assert.equal(datos.columnaLon(0), 2, "columna para longitud 0");
    assert.equal(datos.columnaLon(90), 3, "columna para longitud 90");
    assert.equal(datos.columnaLon(180), 4, "columna para longitud 180");
});

QUnit.test("datos - valores (U,V) en posición", function (assert) {
    var datos = datosMundo90;
    assert.deepEqual(datos.UV_LonLat(-180, -90), [0, 0], "valores UV en esquina inferior izquierda");
    assert.deepEqual(datos.UV_LonLat(0, 0), [0.5, 0.5], "valores UV en ecuador/greenwhich");
    assert.deepEqual(datos.UV_LonLat(180, 90), [0.9, 0.9], "valores UV en esquina superior derecha");
});
