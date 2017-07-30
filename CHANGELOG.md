#v1.0.0
- First public release, with ScalarField and VectorFieldAnim layers. It supports ASCII Grid and GeoTIFF raster files.

#v1.0.1
- VectorFieldAnim: stop animation on remove and field check before drawing, to avoid errors when adding/removing several layers
- local webpack in npm run commands

#v1.0.2
- `interpolate` option is available for `L.CanvasLayer.ScalarField` (thanks to @claustres), see *./docs/example_ScalarField_Interpolation.html*
- automatic copy of `dist` to `docs/dist` when building project with webpack (to be used by examples)

#v1.1.0
- Longitude wrapping when dealing with 0-360º rasters
- Tested to work on Leaflet 1.1.0
- Minor: 
    - No linter warnings when building with `webpack`
    - chromajs updated to 1.3.4

#v1.2.0
- Optional labels in `colorBar` control (see `example_VectorFieldAnim_ColorBar.html`)
- Better colorBar styles and more options
