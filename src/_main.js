// base
import Vector from './Vector.js';
window.L.Vector = Vector;
//window.Vector = Vector; //TODO check window pollution!

import Field from './Field.js';
window.L.Field = Field;

import ScalarField from './ScalarField.js';
window.L.ScalarField = ScalarField;
//window.ScalarField = ScalarField;

import VectorField from './VectorField.js';
window.L.VectorField = VectorField;
//window.VectorField = VectorField;


// layer
var L_CanvasLayer = require('./layer/L.CanvasLayer.js');
var L_CanvasLayer_SimpleLonLat = require('./layer/L.CanvasLayer.SimpleLonLat.js');
// var L.CanvasLayer.Field = require('./layer/L.CanvasLayer.Field.js');
var L_CanvasLayer_ScalarField = require('./layer/L.CanvasLayer.ScalarField.js');
var L_CanvasLayer_VectorFieldAnim = require('./layer/L.CanvasLayer.VectorFieldAnim.js');

// control
var L_Control_ColorBar = require('./control/L.Control.ColorBar.js');


/*
(function (factory, window) {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

    // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        window.L.YourPlugin = factory(L);
    }
}(function (L) {
    var L.Canvas = {};
    // implement your plugin

    // return your plugin when you are done
    return MyLeafletPlugin;
}, window));
*/
