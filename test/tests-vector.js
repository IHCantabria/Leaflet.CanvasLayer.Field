"use strict";

QUnit.module("Vector");
QUnit.test("se puede crear", function (assert) {
    var v = new Vector(0.5, 0.6);
    assert.ok(v.x, 0,5, "x = u");
    assert.ok(v.y, 0,5, "y = v");
});

QUnit.test("calcula longitud", function (assert) {
    var v = new Vector(0.5, 0.6);
    assert.equal(v.longitud().toFixed(2), 0.781, "longitud");
});

QUnit.test("calcula ángulo", function (assert) {
    var v = new Vector(0.0, 1.0);
    assert.equal(v.angulo().toFixed(2), 1.571, "angulo radianes");
});

QUnit.test("calcula ángulo grados", function (assert) {
    var v = new Vector(0.0, 1.0);
    assert.equal(v.anguloGrados(), 90.0, "angulo grados");
});
