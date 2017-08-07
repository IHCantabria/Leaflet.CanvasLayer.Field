/**
 * ScalarField on canvas (a 'Raster')
 */
L.CanvasLayer.ScalarField = L.CanvasLayer.Field.extend({
    options: {
        type: 'colormap', // [colormap|vector]
        arrowSize: 20, // only used if 'vector'
        color: null, // function colorFor(value) [e.g. chromajs.scale],
        interpolate: false // Change to use interpolation
    },

    initialize: function(scalarField, options) {
        L.CanvasLayer.Field.prototype.initialize.call(
            this,
            scalarField,
            options
        );
        L.Util.setOptions(this, options);
    },

    _defaultColorScale: function() {
        return chroma.scale(['white', 'black']).domain(this._field.range);
    },

    setColor(f) {
        this.options.color = f;
        this.needRedraw();
    },

    /* eslint-disable no-unused-vars */
    onDrawLayer: function(viewInfo) {
        if (!this.isVisible()) return;
        this._updateOpacity();

        let r = this._getRendererMethod();
        //console.time('onDrawLayer');
        r();
        //console.timeEnd('onDrawLayer');
    },
    /* eslint-enable no-unused-vars */

    _getRendererMethod: function() {
        switch (this.options.type) {
            case 'colormap':
                return this._drawImage.bind(this);
            case 'vector':
                return this._drawArrows.bind(this);
            default:
                throw Error(`Unkwown renderer type: ${this.options.type}`);
        }
    },

    _ensureColor: function() {
        if (this.options.color === null) {
            this.setColor(this._defaultColorScale());
        }
    },

    _showCanvas() {
        L.CanvasLayer.Field.prototype._showCanvas.call(this);
        this.needRedraw(); // TODO check spurious redraw (e.g. hide/show without moving map)
    },

    /**
     * Draws the field in an ImageData and applying it with putImageData.
     * Used as a reference: http://geoexamples.com/d3-raster-tools-docs/code_samples/raster-pixels-page.html
     */
    _drawImage: function() {
        this._ensureColor();

        let ctx = this._getDrawingContext();
        let width = this._canvas.width;
        let height = this._canvas.height;

        let img = ctx.createImageData(width, height);
        let data = img.data;

        this._prepareImageIn(data, width, height);
        ctx.putImageData(img, 0, 0);
    },

    /**
     * Prepares the image in data, as array with RGBAs
     * [R1, G1, B1, A1, R2, G2, B2, A2...]
     * @private
     * @param {[[Type]]} data   [[Description]]
     * @param {Numver} width
     * @param {Number} height
     */
    _prepareImageIn(data, width, height) {
        let f = this.options.interpolate ? 'interpolatedValueAt' : 'valueAt';

        let pos = 0;
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                let pointCoords = this._map.containerPointToLatLng([i, j]);
                let lon = pointCoords.lng;
                let lat = pointCoords.lat;

                let v = this._field[f](lon, lat); // 'valueAt' | 'interpolatedValueAt' || TODO check some 'artifacts'
                if (v !== null) {
                    let color = this._getColorFor(v);
                    let [R, G, B, A] = color.rgba();
                    data[pos] = R;
                    data[pos + 1] = G;
                    data[pos + 2] = B;
                    data[pos + 3] = parseInt(A * 255); // not percent in alpha but hex 0-255
                }
                pos = pos + 4;
            }
        }
    },

    /**
     * Draws the field as a set of arrows. Direction from 0 to 360 is assumed.
     */
    _drawArrows: function() {
        /*this.setColor(chroma.scale(['red', 'orange']));
        this._drawImage();*/

        var stride = Math.max(
            1,
            Math.floor(1.2 * this.options.arrowSize / this._field.cellSize)
        );

        const cells = this._field.getCells();
        const ctx = this._getDrawingContext();
        for (var c = 0; c < cells.length; c = c + stride) {
            const cell = cells[c];
            if (cell.value !== null) {
                this._drawArrow(cell, ctx);
            }
        }
    },

    _drawArrow: function(cell, ctx) {
        const size = this.options.arrowSize;
        var projected = this._map.latLngToContainerPoint(cell.center);
        var xProjected = projected.x;
        var yProjected = projected.y;

        ctx.save();
        ctx.translate(xProjected, yProjected);
        ctx.rotate((90 + cell.value) * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(+size / 2, 0);
        ctx.moveTo(size * 0.25, -size * 0.25);
        ctx.lineTo(+size / 2, 0);
        ctx.lineTo(size * 0.25, size * 0.25);
        ctx.stroke();
        ctx.restore();
    },

    /**
     * Gets a chroma color for a pixel value, according to 'options.color'
     */
    _getColorFor(v) {
        let c = this.options.color; // e.g. for a constant 'red'
        if (typeof c === 'function') {
            c = this.options.color(v);
        }
        let color = chroma(c); // to be more flexible, a chroma color object is always created || TODO improve efficiency
        return color;
    }
});

L.canvasLayer.scalarField = function(scalarField, options) {
    return new L.CanvasLayer.ScalarField(scalarField, options);
};
