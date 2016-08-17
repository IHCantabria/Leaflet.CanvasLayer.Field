L.Control.LeyendaEscalaColor = L.Control.extend({
    options: {
        position: 'bottomleft',
        pasos: 100,
        ancho: 400
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._map = map;
        let controlDiv = L.DomUtil.create('div', 'leaflet-control-leyendaEscalaColor leaflet-bar leaflet-control');
        /*controlDiv.style.width = this.options.ancho + 'px';
        controlDiv.style.height = this.options.ancho + 'px';*/
        //controlDiv.style.he = this.options.ancho;
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault);

        let svg = this.generarPaleta();
        controlDiv.appendChild(svg);
        return controlDiv;
    },

    generarPaleta: function () {

        // preparación de datos
        let m = this.options.mapaColor;
        let p = this.options.pasos;
        let min = m.dominio[0];
        let max = m.dominio[1];
        let data = _.range(0, 2, max / p);
        let f = m.escala; // función valor --> color
        let colores = data.map(function (d) {
            return f(d).css();
        });

        // svg contenedor
        let w = Math.floor(400 / colores.length);
        let e = document.createElement("svg");
        let svg = d3.select(e);
        svg.attr('width', 400).attr('height', w * 100);

        let cubos = svg.selectAll('rect').data(colores).enter().append('rect');
        cubos
            .attr('x', function (d, i) {
                return i * w;
            })
            .attr('y', function (d) {
                return 0;
            })
            .attr('height', function (d) {
                return w * 4;
            })
            .attr('width', function (d) {
                return w;
            })
            .attr('fill', function (d) {
                return d;
            });
        /*
        let cubosConAtributos = cubos.attr({
            x: function (d, i) {
                return i * w;
            },
            y: function (d) {
                return 0;
            },
            height: function (d) {
                return w;
            },
            width: function (d) {
                return w;
            },
            fill: function (d) {
                return d;
            }
        });
*/

        return svg.node();
    }
});

/*
class Leyenda {
    constructor(div) {
        this._div = div;
    }

    render() {
        this._div.html('<b>Soy una leyenda</b>');
    }
}
*/
