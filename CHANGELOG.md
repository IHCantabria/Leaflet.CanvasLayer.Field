#v1.0.0

* First public release, with ScalarField and VectorFieldAnim layers. It supports ASCII Grid and GeoTIFF raster files.

#v1.0.1

* VectorFieldAnim: stop animation on remove and field check before drawing, to avoid errors when adding/removing several layers
* local webpack in npm run commands

#v1.0.2

* `interpolate` option is available for `L.CanvasLayer.ScalarField` (thanks to @claustres), see _./docs/example_ScalarField_Interpolation.html_
* automatic copy of `dist` to `docs/dist` when building project with webpack (to be used by examples)

#v1.1.0

* Longitude wrapping when dealing with 0-360º rasters
* Tested to work on Leaflet 1.1.0
* Minor:
    * No linter warnings when building with `webpack`
    * chromajs updated to 1.3.4

#v1.2.0

* Optional labels in `colorBar` control (see `example_VectorFieldAnim_ColorBar.html`)
* Better colorBar styles and more options

#v1.2.1

* Fixing absence of interpolation on border (continuous raster)
  [--This still needs to be done! (issue #8)--]

#v1.3.0

* New arrow style for `ScalarField Layer`, based on `leaflet-geotiff` plugin. This is a new renderer activated with`type: vector` (vs. default `colormap`) and it is useful when loading a 'direction' field (0-360º).
* Raises an error when dealing with no regular cell sizes (width !== height). The coordinate calculus is based on regular cells, but irregular grids could be used under some circunstances, generating spatial inconsistencies without a warning.
* Fixes wrong derived values in `VectorField.getScalarField` when no vector is available (zs have to be null); this allows the user to eliminate some previous `inFilter` functions to discard those values.

#v1.3.1

* Rounding issues throws not expected error when mananaging Geotiff with regular size cells. Substitute error with console.warn

#v1.3.2

* Now the plugin correctly manages different x-y pixel size in geotiff files (so it is more flexible and accurate). It also removes `v1.3.1` temporal console warning, described in issue #10
* Change carto basemap urls to https in examples.

#v1.3.3

* Fixed some problems when dealing with 0-360º rasters [wrong wrapped value + interpolation artifact at first column (see v1.2.1)].
* Build: added karma to run jasmine tests (instead of previous manual mode) and webpack-dev-server.
* Minor: deleted unused L.ColorScale class + little adjustments in examples.

#v1.3.4

* Fixed 'RangeError: Maximum call stack size exceeded', when loading some big ASCII Grid files.

#v1.3.5

* Added CI testing with travis, thanks to @sirreal (https://github.com/IHCantabria/Leaflet.CanvasLayer.Field/pull/12)

#v1.4.0

* Added an optional parameter `spatialMask` (+ `setSpatialMask` method) to apply a Clip on `ScalarField`. The mask defines a Polygon as a GeoJSON Feature for which the raster values will be considered (for rendering and identifying operations). See `example_ScalarField_Mask`. This feature uses `@turf/inside`.
* Minor:
    * examples have been updated to work with Leaflet 1.2.0
    * added a little npm badge in README file

#v1.4.1

* Added new method `multipleFromGeoTIFF` to `ScalarField` to return all bands from a GeoTIFF raster file as an array of `ScalarField`, thanks to @santiquetzal (#16).
* Added compatibility with ASCII Grid files using XLLCENTER and YLLCENTER, as suggested in #17

#v1.4.2

* Fix Cell Size issue pointed by @nzahasan in #29
* Update some dependencies (security updates)

#v1.5.3

* PR #61 - Add player control 
* PR #59 - Allow user define map pane
* Remove chroma-js global dependency
* Move project to new npm package (ih-leaflet-canvaslayer-field)
* Update docs & dependencies