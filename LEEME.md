# Pintado de capa con 'campo vectorial animado'

## v0.1
- Pintado de capa animada con 'puntos_bahia.csv' con SVG (un fichero con los datos lon, lat, dir, vel de IH_COAWST), para un instante. Selección de 1 de cada 20 ptos.

## v0.2
- Pintado ágil de capa estática de 'puntos_bahia.csv' sobre el CANVAS, en su totalidad (aprox. 20.000 ptos)

## v0.3
- *CapaVectorAnimado*, para el pintado de trayectorias "fluidas" sobre el canvas
- Se incluyen varios parámetros opcionales, para controlar el pintado de trayectorias
- *CapaPuntos*, para dibujar el grid de base

## preparando v0.4...
- *CapaVectorAnimado* con capacidad para usar como color de línea una escala de color chroma
- *L.Control.LeyendaEscalaColor* un control de leyenda dinámico, con una barra de colores gradual

## Notas técnicas:
- HTML5 & JS ECMAScript 2015 (ES6)
- Libs vía CDN: 
    * D3 v4
    * Leaflet v1.0.0-rc.3
- Libs locales: 
    * [gLayers.Leaflet](https://github.com/Sumbera/gLayers.Leaflet) (v1.0.1) - para crear una capa CanvasLayer
    * [chromajs](https://github.com/gka/chroma.js)(v1.1.1) - colores y escalas
    * [underscore](http://underscorejs.org/) (v1.8.3) - utilidades
- Tests con Jasmine (v2.4)