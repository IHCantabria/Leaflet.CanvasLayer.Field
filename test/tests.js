/**
    Malla mundo, con datos cada 45º
*/
"use strict";
var datosMundo45 = {
    x0: -180.0, // xmin
    y0: -90.0, // ymin
    x1: 180.0, // xmax
    y1: 90, // ymax
    dx: 45.0, // incremento en x
    dy: 45.0, // incremento en y
    ncols() {
        return (this.x1 - this.x0) / this.dx;
    },
    nfilas() {
        return (this.y1 - this.y0) / this.dy;
    },
    nVectores() {
        return this.ncols() * this.nfilas();
    },
    valorEnLonLat(lon, lat) {
        return -1;
    },
    campo: [1.0]
};

QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});


// Datos vectoriales
QUnit.test("datos - filas y columnas", function (assert) {
    var datos = datosMundo45;
    assert.ok(datos.x0 === -180.0, "x0");
    assert.ok(datos.y0 === -90.0, "y0");
    assert.equal(datos.ncols(), 8, "columnas");
    assert.equal(datos.nfilas(), 4, "filas");
    assert.equal(datos.nVectores(), 32, "n vectores");
});

QUnit.test("datos - valor en posición", function (assert) {
    var datos = datosMundo45;
    assert.equal(datos.valorEnLonLat(-180, -90), 0.0, "valor en esquina");
});
