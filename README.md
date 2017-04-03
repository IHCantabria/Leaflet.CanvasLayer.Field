# Leaflet.CanvasLayer.Field

A plugin for [LeafletJS](http://www.leafletjs.com) that adds layers to visualize fields (*aka* **Rasters**) from ASCIIGrid or GeoTIFF files.

## Description

It includes:

* `L.CanvasLayer.ScalarField`: a raster layer from scalars (such as DTM, temperature...)
* `L.CanvasLayer.VectorFieldAnim`: an animated layer representing a vector field (wind, currents...), based on the excellent [earth](https://github.com/cambecc/earth) by Cameron Becarrio

This plugin extends [L.CanvasLayer](https://github.com/Sumbera/gLayers.Leaflet) Leaflet Plugin by Stanislav Sumbera and uses [geotiff.js](https://github.com/constantinius/geotiff.js) by Fabian Schindler. 


## Demos

Velocity currents forecast into the Santander Bay, Spain

### VectorFieldAnim
![Example](TBD: url/to/VectorFieldAnim.gif)

### ScalarField
![Example](TBD: url/to/ScalarField.png)

See the [live examples](TBD: url/to/docs/index.html)


## Requirements

It works with Leaflet >=v1.0.0

The plugin has these dependencies:

- npm:
    * [leaflet](https://github.com/Leaflet/Leaflet)
    * [chroma-js](https://github.com/gka/chroma.js)
    * [geotiff](https://github.com/constantinius/geotiff.js)
    * [d3](https://github.com/d3/d3)
    
- already included in src & dist: 
    * [gLayers.Leaflet](https://github.com/Sumbera/gLayers.Leaflet) (v1.0.1) - full canvas layer


## Instructions



## License
Licensed under the GNU General Public License v3.0



