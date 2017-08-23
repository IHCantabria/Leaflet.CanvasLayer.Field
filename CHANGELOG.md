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

#v1.2.1
- Fixing absence of interpolation on border (continuous raster)
[--This still needs to be done! (issue #8)--]

#v1.3.0
- New arrow style for `ScalarField Layer`, based on `leaflet-geotiff` plugin. This is a new renderer activated with`type: vector` (vs. default `colormap`) and it is useful when loading a 'direction' field (0-360º).
- Raises an error when dealing with no regular cell sizes (width !== height). The coordinate calculus is based on regular cells, but irregular grids could be used under some circunstances, generating spatial inconsistencies without a warning.
- Fixes wrong derived values in `VectorField.getScalarField` when no vector is available (zs have to be null); this allows the user to eliminate some previous `inFilter` functions to discard those values.

#v1.3.1
- Rounding issues throws not expected error when mananaging Geotiff with regular size cells. Substitute error with console.warn

#v1.3.2 in progress...
- Now the plugin correctly manages different x-y pixel size in geotiff files (so it is more flexible and accurate). It also removes `v1.3.1` temporal warning such as in issue #10
- TODO. Add 'arrow renderer' image to README
- TODO. Change carto basemap urls to https
- ?