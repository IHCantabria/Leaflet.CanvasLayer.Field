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
require('./layer/L.CanvasLayer.js');
require('./layer/L.CanvasLayer.SimpleLonLat.js');
require('./layer/L.CanvasLayer.Field.js');
require('./layer/L.CanvasLayer.ScalarField.js');
require('./layer/L.CanvasLayer.VectorFieldAnim.js');

// control
require('./control/L.Control.ColorBar.js');
require('./control/L.Control.LayersPlayer.js');
