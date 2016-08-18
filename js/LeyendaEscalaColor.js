L.Control.LeyendaEscalaColor = L.Control.extend({
    options: {
        position: 'bottomleft',
        ancho: 400,
        alto: 50,
        leyenda: {
            pasos: 100
        }
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._map = map;
        let controlDiv = L.DomUtil.create('div', 'leaflet-control-leyendaEscalaColor leaflet-bar leaflet-control');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault);

        controlDiv.innerHTML = this.paleta();
        return controlDiv;
    },

    paleta: function () {
        // preparación de datos
        let m = this.options.mapaColor;
        let min = m.dominio[0];
        let max = m.dominio[1];
        let data = _.range(0, 2, (max - min) / this.options.leyenda.pasos);
        let f = m.escala; // función valor --> color
        let colores = data.map(d => f(d).css());

        // div.contenedor > svg
        let w = Math.floor(this.options.ancho / colores.length);
        let d = document.createElement("div");
        let svg = d3.select(d).append("svg")
            .attr('width', this.options.ancho)
            .attr('height', this.options.alto);
        //.style('position', 'absolute');

        // n barras de color
        let cubos = svg.selectAll('rect').data(colores).enter().append('rect');
        cubos
            .attr('x', (d, i) => i * w)
            .attr('y', (d) => 0)
            .attr('height', (d) => w * 4)
            .attr('width', (d) => w)
            .attr('fill', (d) => d);
        return d.innerHTML;
    }
});
