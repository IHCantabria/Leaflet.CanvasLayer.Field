/**
 *   Control for a simple legend with a colorbar
 *   References:
 *      - http://jsfiddle.net/ramnathv/g8stqcf6/
 *      - http://jsfiddle.net/vis4/cYLZH/
 */
L.Control.ColorBar = L.Control.extend({
    options: {
        position: 'bottomleft',
        width: 300,
        height: 15,
        background: 'transparent',
        legend: {
            steps: 100,
            decimals: 2
        }
    },

    initialize: function (colorMap, options) {
        this.colorMap = colorMap; // 'chromajs' scale function
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._map = map;
        let div = L.DomUtil.create('div', 'leaflet-control-leyendaEscalaColor leaflet-bar leaflet-control');
        L.DomEvent
            .addListener(div, 'click', L.DomEvent.stopPropagation)
            .addListener(div, 'click', L.DomEvent.preventDefault);
        div.style.backgroundColor = this.options.background;
        div.style.cursor = 'text';
        div.innerHTML = this.palette();
        return div;
    },

    palette: function () {
        // data preparation
        let m = this.colorMap; // <<<
        let min = m.domain[0];
        let max = m.domain[1];
        let delta = (max - min) / (this.options.legend.steps);
        let data = _.range(min, max + delta, delta);
        let colorPerValue = data.map(d => {
            return {
                "value": d,
                "color": m.scale(d).css() //value --> css color
            }
        });

        // div.contenedor > svg
        let w = this.options.width / colorPerValue.length;
        let d = document.createElement("div");
        let svg = d3.select(d).append("svg")
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .style('padding', '10px'); //

        // n color-bars
        let buckets = svg.selectAll('rect').data(colorPerValue).enter().append('rect');
        buckets
            .attr('x', (d, i) => i * w)
            .attr('y', (d) => 0)
            .attr('height', (d) => this.options.height /*w * 4*/ )
            .attr('width', (d) => w)
            .attr('fill', (d) => d.color);

        buckets.append('title').text(
            (d) => `${d.value.toFixed(this.options.legend.decimals)} ${m.units}`
        );
        return d.innerHTML;
    }
});

L.control.colorBar = function (colorMap, options) {
    return new L.Control.ColorBar(colorMap, options);
};
