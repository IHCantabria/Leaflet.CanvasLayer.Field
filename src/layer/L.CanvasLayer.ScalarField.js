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

        let p = this._pyramidFor(viewInfo);
        let cells = this.field.getCellsForPyramid(p);
        let cellsOnScreen = cells.filter(c => viewInfo.bounds.intersects(c.bounds));
        this._draw(cellsOnScreen);

        console.timeEnd('onDrawLayer');
    },


    /**
     * Select the best raster pyramid level for the current view
     * @param   {Object} viewInfo
     * @returns {Number} n of pyramid (1:all | 2:half resolution...)
     */
    _pyramidFor: function (viewInfo) {

        console.log(viewInfo);

        // meters per pixel
        /*
        let mapResolution = 40075016.686 * Math.abs(Math.cos(this._map.getCenter().lat * 180 / Math.PI)) / Math.pow(2, this._map.getZoom() + 8);
        */

        // let resolution = this.field.getResolution();

        let pyramids = [1];
        let p = 1;

        while (this.field.ncols / p > 1) {
            p = p * 2;
            pyramids.push(p);
        }
        console.log(pyramids);

        return 2; // allthis._map

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

    _draw: function (cells) {
        let g = this._getDrawingContext();
        for (let c of cells) {
            if (c.value !== null) {
                this._drawRectangle(g, c);
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
        let r = this._getRectangle(cell.bounds);
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
