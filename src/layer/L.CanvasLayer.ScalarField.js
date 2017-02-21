/**
 * ScalarField on canvas (a 'Raster')
 */
L.CanvasLayer.ScalarField = L.CanvasLayer.Field.extend({

    options: {
        color: null, // function colorFor(value) [e.g. chromajs.scale],
        interpolate: false
    },

    initialize: function (scalarField, options) {
        L.CanvasLayer.Field.prototype.initialize.call(this, scalarField, options);
        L.Util.setOptions(this, options);

        if (this.options.color === null) {
            this.options.color = this._defaultColorScale();
        }
    },

    _defaultColorScale: function () {
        return chroma.scale(['white', 'black']).domain(this.field.range);
    },

    onDrawLayer: function (viewInfo) {
        console.time('onDrawLayer');

        this._drawImage();

        console.timeEnd('onDrawLayer');
    },

    /**
     * Draws the field in an ImageData and applying it with putImageData.
     * Used as a reference: http://geoexamples.com/d3-raster-tools-docs/code_samples/raster-pixels-page.html
     */
    _drawImage: function () {
        let ctx = this._getDrawingContext();
        let width = this._canvas.width;
        let height = this._canvas.height;
        let img = ctx.createImageData(width, height);
        let data = img.data;

        this._prepareImage(data, width, height);

        ctx.putImageData(img, 0, 0);
    },

    /**
     * Prepares the image in data, as RGBA array
     */
    _prepareImage(data, width, height) {
        let f = (this.options.interpolate) ? 'interpolatedValueAt' : 'valueAt';

        let pos = 0;
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                let pointCoords = this._map.containerPointToLatLng([i, j]);
                let lon = pointCoords.lng;
                let lat = pointCoords.lat;

                if (this.field.hasValueAt(lon, lat)) {
                    let v = this.field[f](lon, lat); // 'valueAt' | 'interpolatedValueAt' || TODO check

                    let color = this._getColorFor(v);

                    let rgb = color.rgb();
                    let R = parseInt(rgb[0]);
                    let G = parseInt(rgb[1]);
                    let B = parseInt(rgb[2]);
                    let A = 255; // :(, no alpha
                    data[pos] = R;
                    data[pos + 1] = G;
                    data[pos + 2] = B;
                    data[pos + 3] = A;
                }
                pos = pos + 4;
            }
        }
    },

    /**
     * Gets a chroma color for a pixel value, according to 'options.color'
     */
    _getColorFor(v) {
        let c = this.options.color; // e.g. for a constant 'red'
        if (typeof c == 'function') {
            c = this.options.color(v);
        }
        let color = chroma(c); // to be more flexible, a chroma color object is always created || TODO check efficiency
        return color;
    }
});

L.canvasLayer.scalarField = function (scalarField, options) {
    return new L.CanvasLayer.ScalarField(scalarField, options);
};
