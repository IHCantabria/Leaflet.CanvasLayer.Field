# Pintado de capa con 'campo vectorial animado'

## v0.1
- Pintado de capa animada con 'puntos_bahia.csv' (un fichero con los datos lon, lat, dir, vel de IH_COAWST), para un instante.



## Notas técnicas:
- HTML5
- JS ecmascript 2015
- Libs vía CDN: D3 (v3) y Leaflet (v0.7)
- Libs locales: 
    * [Leaflet.GeometryUtil](https://github.com/makinacorpus/Leaflet.GeometryUtil/) (v0.4.0) - para cálculos geométricos
    * [gLayers.Leaflet](https://github.com/Sumbera/gLayers.Leaflet) (v1.0.1) - para crear una capa CanvasLayer
- Tests con Jasmine (v2.4)