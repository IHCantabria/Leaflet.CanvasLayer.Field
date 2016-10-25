/**
 *  Abstract class for a set of values (Vector | Scalar)
 *  assigned to a regular 2D-grid (lon-lat), aka "a Raster layer"
 */
class Field {

    constructor(params) {
        if (new.target === Field) {
            throw new TypeError("Cannot construct Field instances directly (use VectorField or ScalarField)");
        }
