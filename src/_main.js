/* eslint global-require: "error" */

// base
import Vector from './Vector.js';
window.L.Vector = Vector;

import Cell from './Cell.js';
window.L.Cell = Cell;

import Field from './Field.js';
window.L.Field = Field;

import ScalarField from './ScalarField.js';
window.L.ScalarField = ScalarField;

import VectorField from './VectorField.js';
window.L.VectorField = VectorField;

// layer
var L_CanvasLayer = require('./layer/L.CanvasLayer.js');
var L_CanvasLayer_SimpleLonLat = require('./layer/L.CanvasLayer.SimpleLonLat.js');
var L_CanvasLayer_Field = require('./layer/L.CanvasLayer.Field.js');
var L_CanvasLayer_ScalarField = require('./layer/L.CanvasLayer.ScalarField.js');
var L_CanvasLayer_VectorFieldAnim = require('./layer/L.CanvasLayer.VectorFieldAnim.js');

// control
var L_Control_ColorBar = require('./control/L.Control.ColorBar.js');


// TODO - umd pattern?
