L.Control.LeyendaEscalaColor = L.Control.extend({
    options: {
        position: 'bottomleft',
        ancho: 300,
        alto: 15,
        fondo: 'transparent',
        leyenda: {
            pasos: 100,
            decimales: 2
        }
    },

    onAdd: function (map) {
        this._map = map;
        let controlDiv = L.DomUtil.create('div', 'leaflet-control-leyendaEscalaColor leaflet-bar leaflet-control');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault);
        controlDiv.style.backgroundColor = this.options.fondo;
        controlDiv.style.cursor = 'text';
        controlDiv.innerHTML = this.paleta();
        return controlDiv;
    },

    paleta: function () {
        // preparación de datos
        let m = this.options.mapaColor;
        let min = m.dominio[0];
        let max = m.dominio[1];
        let incremento = (max - min) / (this.options.leyenda.pasos);
        let data = _.range(min, max + incremento, incremento);
        let colorPorValor = data.map(d => {
            return {
                "valor": d,
                "color": m.escala(d).css() //función valor --> color css
            }
        });

        // div.contenedor > svg
        let w = Math.floor(this.options.ancho / colorPorValor.length);
        let d = document.createElement("div");
        let svg = d3.select(d).append("svg")
            .attr('width', this.options.ancho)
            .attr('height', this.options.alto)
            .style('padding', '10px'); //

        // n barras de color
        let cubos = svg.selectAll('rect').data(colorPorValor).enter().append('rect');
        cubos
            .attr('x', (d, i) => i * w)
            .attr('y', (d) => 0)
            .attr('height', (d) => this.options.alto /*w * 4*/ )
            .attr('width', (d) => w)
            .attr('fill', (d) => d.color);

        cubos.append('title').text(
            (d) => `${d.valor.toFixed(this.options.leyenda.decimales)} ${this.options.mapaColor.unidades}`
        );
        return d.innerHTML;
    }
});
