/**
 * ScalarField on canvas (a 'Raster')
 */
L.CanvasLayer.ScalarField = L.CanvasLayer.Field.extend({

    options: {
        color: null // function colorFor(value) [e.g. chromajs.scale]
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

        // Individual cell paint
        //        let level = this._pyramidLevelFor(viewInfo);
        //        let p = this.field.getPyramid(level);
        //        let cellsOnScreen = p.getCells().filter(c => viewInfo.bounds.intersects(c.getBounds()));
        //        this._draw(cellsOnScreen);

        this._drawImage();

        console.timeEnd('onDrawLayer');
    },

    _drawImage: function () {
        let ctx = this._getDrawingContext();
        /* Building an image and just one render */
        /* taken from: http://geoexamples.com/d3-raster-tools-docs/code_samples/raster-pixels-page.html*/
        let width = this._canvas.width;
        let height = this._canvas.height;

        let img = ctx.createImageData(width, height);
        let data = img.data;

        var pos = 0;
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                let pointCoords = this._map.containerPointToLatLng([i, j]);
                let lon = pointCoords.lng;
                let lat = pointCoords.lat;
                if (this.field.hasValueAt(lon, lat)) {
                    let v = this.field.valueAt(lon, lat);
                    let color = this.options.color(v).rgb();
                    let R = parseInt(color[0]);
                    let G = parseInt(color[1]);
                    let B = parseInt(color[2]);
                    let A = 255; // TODO
                    data[pos] = R;
                    data[pos + 1] = G;
                    data[pos + 2] = B;
                    data[pos + 3] = A;
                }
                pos = pos + 4;
            }
        }
        ctx.putImageData(img, 0, 0);
    },

    /**
     * Select the best raster pyramid level for the current view
     * @param   {Object} viewInfo
     * @returns {Number} n of pyramid (1:all | 2:half resolution...)
     */
    _pyramidLevelFor: function (viewInfo) {
        console.log(viewInfo);
        // meters per pixel

        let mres = this._mapResolution();
        console.log('Map resolution: ', mres);

        let plevels = this.field.getPyramidLevels();
        console.log('Get pyramid levels: ', plevels);
        // let resolution = this.field.getResolution();

        let pyramids = [];
        let p = 1;

        return 1; // allthis._map ||TODO

        /*let steps = [];
        let n = this.field.ncols;
        console.log('ncols ', n);

        let i = 1;
        while (n / i > 1) {
            steps.push[i];
            i = i * 2;
            console.log(i);
        }

        console.log(viewInfo);
        return steps[steps.length - 1]; // TODO fit resolution
        */
    },

    _mapResolution: function () {
        return 40075016.686 * Math.abs(Math.cos(this._map.getCenter().lat * 180 / Math.PI)) / Math.pow(2, this._map.getZoom() + 8);
    },

    _draw: function (cells) {
        let ctx = this._getDrawingContext();
        for (let c of cells) {
            if (c.value !== null) {
                this._drawRectangle(ctx, c);
            }
        }
    },

    /**
     * Draw a pixel on canvas
     * @param {object} g    [[Description]]
     * @param {object} cell [[Description]]
     */
    _drawRectangle: function (g, cell) {
        g.fillStyle = this.options.color(cell.value);
        let r = this._getRectangle(cell.getBounds());
        //g.fillRect(r.x, r.y, r.width, r.height); // TODO check drawing speed
        g.fillRect(Math.round(r.x), Math.round(r.y), r.width, r.height);
    },

    /**
     * Get rectangle to draw on canvas, aka 'pixel'
     * @param   {LatLngBounds} cellBounds
     * @returns {Object} {x, y, width, height}
     */
    _getRectangle: function (cellBounds) {
        let upperLeft = this._map.latLngToContainerPoint(
            cellBounds.getNorthWest());
        let lowerRight = this._map.latLngToContainerPoint(
            cellBounds.getSouthEast());
        let width = Math.abs(upperLeft.x - lowerRight.x);
        let height = Math.abs(upperLeft.y - lowerRight.y);

        let r = {
            x: upperLeft.x,
            y: upperLeft.y,
            width,
            height
        };
        return r;
    },

    _getPixelColor: function (x, y) {
        throw new Error('Not working!'); // TODO FIX
        /*let ctx = this._canvas.getContext('2d');
        let pixel = ctx.getImageData(x, y, 1, 1).data;

        // array [r, g, b, a]
        return chroma(pixel[0], pixel[1], pixel[2]);*/
    },

});

L.canvasLayer.scalarField = function (scalarField, options) {
    return new L.CanvasLayer.ScalarField(scalarField, options);
};
