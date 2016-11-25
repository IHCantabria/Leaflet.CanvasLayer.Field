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
            this.options.color = this.defaultColorScale();
        }
        this.cells = scalarField.gridLonLatValue();
    },

    defaultColorScale: function () {
        return chroma.scale(['white', 'black']).domain(this.field.range);
    },

    onDrawLayer: function (viewInfo) {
        //console.time('onDrawLayer');

        let g = this._getDrawingContext();

        //for (var i = 0; i < this.cells.length; i++) {
        for (var i = 0; i < this.cells.length; i++) {
            let cell = this.cells[i];

            if (cell.value === null) {
                continue; //no data
            }

            cell.bounds = this.getCellBounds(cell);
            let cellIsVisible = viewInfo.bounds.intersects(cell.bounds);
            if (!cellIsVisible) {
                continue; // TODO amend 'flicker' effect on map-pan
            }

            this.drawRectangle(g, cell);
        }
        //console.timeEnd('onDrawLayer');
    },

    /**
     * Bounds for a cell (coordinates of its limits)
     * @param   {Object}   cell
     * @returns {LatLngBounds}
     */
    getCellBounds: function (cell) {
        let half = this.field.cellsize / 2.0;
        let ul = L.latLng([cell.lat + half, cell.lon - half]);
        let lr = L.latLng([cell.lat - half, cell.lon + half]);

        return L.latLngBounds(L.latLng(lr.lat, ul.lng), L.latLng(ul.lat, lr.lng));
    },

    /**
     * Draw a pixel on canvas
     * @param {object} g    [[Description]]
     * @param {object} cell [[Description]]
     */
    drawRectangle: function (g, cell) {
        g.fillStyle = this.options.color(cell.value);
        let r = this.getRectangle(cell.bounds);
        //g.fillRect(r.x, r.y, r.width, r.height); // TODO check drawing speed
        g.fillRect(Math.round(r.x), Math.round(r.y), r.width, r.height);

    },

    /**
     * Get rectangle to draw on canvas, aka 'pixel'
     * @param   {LatLngBounds} cellBounds
     * @returns {Object} {x, y, width, height}
     */
    getRectangle: function (cellBounds) {
        let upperLeft = this._map.latLngToContainerPoint(
            cellBounds.getNorthWest());
        let lowerRight = this._map.latLngToContainerPoint(
            cellBounds.getSouthEast());
        let width = Math.abs(upperLeft.x - lowerRight.x);
        let height = Math.abs(upperLeft.y - lowerRight.y);

        let pixel = {
            x: upperLeft.x,
            y: upperLeft.y,
            width,
            height
        };
        return pixel;
    },

    getPixelColor: function (x, y) {
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
