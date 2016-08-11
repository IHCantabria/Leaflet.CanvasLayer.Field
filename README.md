# Pintado de capa con 'campo vectorial animado'

## v0.1
- Pintado de capa animada con 'puntos_bahia.csv' con SVG (un fichero con los datos lon, lat, dir, vel de IH_COAWST), para un instante. Selección de 1 de cada 20 ptos.

## v0.2
- Pintado ágil de capa estática de 'puntos_bahia.csv' sobre el CANVAS, en su totalidad (aprox. 20.000 ptos)

## v0.3
- Primer pintado de trayectorias "fluidas", sobre el CANVAS


## Notas técnicas:
- HTML5
- JS ecmascript 2015
- Libs vía CDN: 
    * D3 (v3) 
    * Leaflet (v1.0-rc)
    * Underscore ()
- Libs locales: 
    * [Leaflet.GeometryUtil](https://github.com/makinacorpus/Leaflet.GeometryUtil/) (v0.4.0) - para cálculos geométricos
    * [gLayers.Leaflet](https://github.com/Sumbera/gLayers.Leaflet) (v1.0.1) - para crear una capa CanvasLayer
- Tests con Jasmine (v2.4)