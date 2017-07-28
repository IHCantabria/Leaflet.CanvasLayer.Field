/**
 * Based on:
 * http://github.com/santilland/plotty/blob/master/src/plotty.js and
 * http://geoexamples.com/d3-raster-tools-docs
 */
L.ColorScale = L.Class.extend({

    options: {
        width: 256, /* nº of steps = width */
        height: 1, /* 1 is enough to get an array of colours */
        domain: [0, 1],
        clampLow: false,
        clampHigh: false
    },

    initialize: function(definition, options) {
        L.setOptions(this, options);

        this.definition = L.ColorScale.buildFullDefinition(definition);
        this._prepareScale();
    },

    setDomain: function(d) {
        this.options.domain = d;
        return this;
    },

    colorFor: function(value) {
        const [min, max] = this.options.domain;
        const range = max - min;

        var c = Math.round((this.options.width - 1) * ((value - min)/ range));

        // clamp values?
        let alpha = 255;
        if (c < 0) {
            c = 0;
            if (!this.options.clampLow) {
                alpha = 0;
            }
        }

        if (c > this.options.width - 1) {
            c = this.options.width - 1;
            if (!this.options.clampHigh) {
                alpha = 0;
            }
        }

        let A = alpha;
        let R = this.csImageData[c * 4];
        let G = this.csImageData[c * 4 + 1];
        let B = this.csImageData[c * 4 + 2];

        return [R, G, B, A];
    },

    flip: function() {
        let newDefinition = Object.assign({}, this.definition);
        newDefinition.colors = this.definition.colors.reverse(); // << flip color order from original

        let flipped = new L.ColorScale(newDefinition, this.options); // with same options
        return flipped;
    },

    _prepareScale: function() {
        let c = this._createCanvas();
        let ctx = c.getContext('2d');
        this._createGradientIn(ctx);

        this.canvas = c;
        this.csImageData = ctx.getImageData(0, 0, this.options.width, 1).data;
    },

    _createCanvas: function() {
        let c = document.createElement('canvas');
        c.width = this.options.width;
        c.height = this.options.height;
        return c;
    },

    _createGradientIn: function(ctx) {
        let g = ctx.createLinearGradient(0, 0, this.options.width, 0);

        // draw linear gradient with colors and stops from definition
        let d = this.definition;
        for (let i = 0; i < d.colors.length; ++i) {
            g.addColorStop(d.positions[i], d.colors[i]);
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.options.width, this.options.height);
    }

});

L.colorScale = function (def, options) {
    return new L.ColorScale(def, options);
};

L.ColorScale.buildFullDefinition = function (def){
    // Allows conversion from definition = ['color1', 'color2'...] to definition = {colors: ['color1', 'color2']}
    if(!def.colors && Array.isArray(def)){
        def = {colors: def};
    }

    // There are colors, but no positions (equally interval is assumed).
    if (!def.positions){
        let number = def.colors.length;
        let delta = 1.0 / (number - 1);
        let pos = [];
        let p = 0;
        do {
            pos.push(p);
            p = p + delta;
        } while (p <=1.0);
        def.positions = pos;
    }
    return def;
};

L.ColorScale.get = function(name) {

    // https://github.com/santilland/plotty/

    /* eslint-disable max-len */
    /* A colorScale definition is a set of 'colors' and optionally one position for each color,
    in a gradient from 0 to 1 */
    let scales = {
        viridis: {
            colors: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825']
        },
        rainbow: {
            colors: ['#96005A', '#0000C8', '#0019FF', '#0098FF', '#2CFF96', '#97FF00', '#FFEA00', '#FF6F00', '#FF0000'],
            positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
        },
        jet: {
            colors: ['#000083', '#003CAA', '#05FFFF', '#FFFF00', '#FA0000', '#800000'],
            positions: [0, 0.125, 0.375, 0.625, 0.875, 1]
        },
        hsv: {
            colors: ['#ff0000', '#fdff02', '#f7ff02', '#00fc04', '#00fc0a', '#01f9ff', '#0200fd', '#0800fd', '#ff00fb', '#ff00f5', '#ff0006'],
            positions: [0, 0.169, 0.173, 0.337, 0.341, 0.506, 0.671, 0.675, 0.839, 0.843, 1]
        },
        hot: {
            colors: ['#000000', '#e60000', '#ffd200', '#ffffff'],
            positions: [0, 0.3, 0.6, 1]
        },
        cool: {
            colors: ['#00ffff', '#ff00ff'],
            positions: [0, 1]
        },
        spring: {
            colors: ['#ff00ff', '#ffff00'],
            positions: [0, 1]
        },
        summer: {
            colors: ['#008066', '#ffff66'],
            positions: [0, 1]
        },
        autumn: {
            colors: ['#ff0000', '#ffff00'],
            positions: [0, 1]
        },
        winter: {
            colors: ['#0000ff', '#00ff80'],
            positions: [0, 1]
        },
        bone: {
            colors: ['#000000', '#545474', '#a9c8c8', '#ffffff'],
            positions: [0, 0.376, 0.753, 1]
        },
        copper: {
            colors: ['#000000', '#ffa066', '#ffc77f'],
            positions: [0, 0.804, 1]
        },
        greys: {
            colors: ['#000000', '#ffffff'],
            positions: [0, 1]
        },
        picnic: {
            colors: ['#0000ff', '#3399ff', '#66ccff', '#99ccff', '#ccccff', '#ffffff', '#ffccff', '#ff99ff', '#ff66cc', '#ff6666', '#ff0000'],
            positions: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        },
        portland: {
            colors: ['#0c3383', '#0a88ba', '#f2d338', '#f28f38', '#d91e1e'],
            positions: [0, 0.25, 0.5, 0.75, 1]
        },
        blackbody: {
            colors: ['#000000', '#e60000', '#e6d200', '#ffffff', '#a0c8ff'],
            positions: [0, 0.2, 0.4, 0.7, 1]
        },
        earth: {
            colors: ['#000082', '#00b4b4', '#28d228', '#e6e632', '#784614', '#ffffff'],
            positions: [0, 0.1, 0.2, 0.4, 0.6, 1]
        },
        electric: {
            colors: ['#000000', '#1e0064', '#780064', '#a05a00', '#e6c800', '#fffadc'],
            positions: [0, 0.15, 0.4, 0.6, 0.8, 1]
        },

        yignbu: {
            colors: ['#081d58', '#253494', '#225ea8', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4', '#edf8d9', '#ffffd9'],
            positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
        },
        greens: {
            colors: ['#00441b', '#006d2c', '#238b45', '#41ab5d', '#74c476', '#a1d99b', '#c7e9c0', '#e5f5e0', '#f7fcf5'],
            positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
        },
        yiorrd: {
            colors: ['#800026', '#bd0026', '#e31a1c', '#fc4e2a', '#fd8d3c', '#feb24c', '#fed976', '#ffeda0', '#ffffcc'],
            positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
        },
        bluered: {
            colors: ['#0000ff', '#ff0000'],
            positions: [0, 1]
        },
        rdbu: {
            colors: ['#050aac', '#6a89f7', '#bebebe', '#dcaa84', '#e6915a', '#b20a1c'],
            positions: [0, 0.35, 0.5, 0.6, 0.7, 1]
        }
    };
    // TODO. a method to list available color scales

    /* eslint-enable max-len */

    var definition = scales[name.toLowerCase()];
    var cs = new L.ColorScale(definition);
    return cs;
};

L.ColorScale.rgbToHex = function(r, g, b){
    const rgb = [r, g, b];

    function _componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    return '#' + rgb.map(_componentToHex).join('');
};

L.ColorScale.hexToRgb = function(hexWithPrefix){
    let hex = hexWithPrefix.slice(1);
    let arrBuff = new ArrayBuffer(4);
    let vw = new DataView(arrBuff);
    vw.setUint32(0, parseInt(hex, 16), false);
    let arrByte = new Uint8Array(arrBuff);

    let r = arrByte[1];
    let g = arrByte[2];
    let b = arrByte[3];
    return [r, g, b];
};
