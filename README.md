# L.CanvasLayer.VectorFieldAnim

## Description
An animated layer representing a vector field, such as wind or ocean currents, based on the excellent [earth](https://github.com/cambecc/earth) by Cameron Becarrio and [L.CanvasLayer](https://github.com/Sumbera/gLayers.Leaflet) Leaflet Plugin by Sumbera.

![Example](https://url-to-image.gif "Example")


## Requirements
### Leaflet version
Tested on v1.0.0

### Dependencies
- CDN
    * D3 v4
    * Leaflet v1.0.0-rc.3
- Included: 
    * [gLayers.Leaflet](https://github.com/Sumbera/gLayers.Leaflet) (v1.0.1) - full canvas layer
    * [chromajs](https://github.com/gka/chroma.js)(v1.1.1) - color and scales
    * [underscore](http://underscorejs.org/) (v1.8.3) - utilities
- Some tests with Jasmine (v2.4)

### Browser / device compatibility
- It uses HTML5 & JS ECMAScript 2015 (ES6)




## Demos
See the [examples](https://todo-somesamples.html)



## Instructions
TBD


## Simple code



## API Reference

* * * 

# Historia del plugin

## v0.1
- Pintado de capa animada con 'puntos_bahia.csv' con SVG y D3 (un fichero con los datos lon, lat, dir, vel de IH_COAWST), para un instante. Selección de 1 de cada 20 ptos.

## v0.2
- Pintado de capa estática de 'puntos_bahia.csv' sobre el CANVAS, en su totalidad (aprox. 20.000 ptos)

## v0.3
- Primera versión de *CapaVectorAnimado*, para un pintado de trayectorias "que fluyen" sobre el canvas.
- Se incluyen varios parámetros opcionales, para controlar el pintado de paths
- Creación de una *CapaPuntos* para dibujar el grid de base

## v0.4
- *L.CapaVectorAnimado* con capacidad para usar como color de línea una escala de color chromajs
- Manejo del Evento 'click_vector', que permite identificar el valor del vector en un punto.
- *L.Control.LeyendaEscalaColor* un control de leyenda con una barra de colores

## v0.5
- Registro tareas en Trello: https://trello.com/b/EY11B3wl/vector2anim
- *L.CapaVectorAnimado* con getBounds
- Refactoring y ajustes internos

## en proceso de v0.6...
- Refactoring de VectorField --> Field, para permitir después el manejo de ScalarField

## Notas técnicas:

- Tests con Jasmine 


