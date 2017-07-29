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
        background: '#fff',
        textColor: 'black',
        steps: 100,
        decimals: 2,
        units: 'uds', // ej: m/s
        title: 'Legend', // ej: Ocean Currents
    },

    initialize: function (color, range, options) {
        this.color = color; // 'chromajs' scale function
        this.range = range; // [min, max]
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._map = map;
        let div = L.DomUtil.create('div', 'leaflet-control-colorBar leaflet-bar leaflet-control');
        L.DomEvent
            .addListener(div, 'click', L.DomEvent.stopPropagation)
            .addListener(div, 'click', L.DomEvent.preventDefault);
        div.style.backgroundColor = this.options.background;
        div.style.cursor = 'text';
        div.innerHTML = this.title() + this.palette();
        return div;
    },

    title: function () {
        let d = document.createElement('div');
        d3.select(d).append('span')
            .style('color', this.options.textColor)
            .style('padding-left', '10px')
            .style('padding-top', '5px')
            .style('display', 'block')
            .attr('class', 'leaflet-control-colorBar-title')
            .text(this.options.title);           
        return d.innerHTML;
    },

    palette: function () {
        // data preparation
        let min = this.range[0];
        let max = this.range[1];
        let delta = (max - min) / (this.options.steps);
        let data = d3.range(min, max + delta, delta);
        let colorPerValue = data.map(d => {
            return {
                'value': d,
                'color': this.color(d)
            };
        });

        // div.contenedor > svg
        let w = this.options.width / colorPerValue.length;
        let d = document.createElement('div');
        let svg = d3.select(d).append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .style('padding', '10px'); //

        // n color-bars
        let buckets = svg.selectAll('rect').data(colorPerValue).enter().append('rect');
        buckets
            .attr('x', (d, i) => i * w)
            .attr('y', () => 0)
            .attr('height', () => this.options.height /*w * 4*/ )
            .attr('width', () => w)
            .attr('stroke-opacity', () => 0)                        
            .attr('fill', (d) => d.color);

        buckets.append('title').text(
            (d) => `${d.value.toFixed(this.options.decimals)} ${this.options.units}`
        );
        return d.innerHTML;
    }
});

L.control.colorBar = function (color, range, options) {
    return new L.Control.ColorBar(color, range, options);
};
