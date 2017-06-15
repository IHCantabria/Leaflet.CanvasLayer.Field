#v1.0.0
- First public release, with ScalarField and VectorFieldAnim layers. It supports ASCII Grid and GeoTIFF raster files.

#v1.0.1
- VectorFieldAnim: stop animation on remove and field check before drawing, to avoid errors when adding/removing several layers
- local webpack in npm run commands

#v1.0.2
- `interpolate` option is available for `L.CanvasLayer.ScalarField` (thanks to @claustres), see *./docs/example_ScalarField_Interpolation.html*
- automatic copy of `dist` to `docs/dist` (to be used by examples)
