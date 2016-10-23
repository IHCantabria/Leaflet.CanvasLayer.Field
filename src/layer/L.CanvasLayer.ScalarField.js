/**
 * ScalarField ('Raster') on canvas
 */
L.CanvasLayer.ScalarField = L.CanvasLayer.extend({
    options: {
        click: true, // 'click' event
        color: null // function colorFor(value);
    },

    initialize: function (scalarField, options) {
        console.time('initialize');

        this.field = scalarField;
        this.cells = this.field.gridLonLatValue();
        L.Util.setOptions(this, options);
        if (this.options.color === null) {
            this.options.color = this.defaultColorScale();
        };

        console.timeEnd('initialize');
    },

    defaultColorScale: function () {
        return chroma.scale(['black', 'white']).domain(this.field.range);
    },

    onLayerDidMount: function () {
        if (this.options.click) {
            this._map.on('mouseover', this._activateClick, this);
            this._map.on('click', this._queryValue, this);
        }
    },

    onLayerWillUnmount: function () {
        if (this.options.click) {
            this._map.off('mouseover', this._activateClick, this);
            this._map.off('click', this._queryValue, this);
        }
    },

    setData: function (data) {
        // -- custom data set
        // TODO
        this.needRedraw(); // -- call to drawLayer
    },

    onDrawLayer: function (viewInfo) {
        console.time('onDrawLayer');

        // canvas preparation
        let g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);

        let halfCell = this.field.cellsize / 2.0;
        for (var i = 0; i < this.cells.length; i++) {
            let {
                lon, lat, value
            } = this.cells[i];

            // no-data?
            if (value === null) {
                continue;
            }

            // pixel limits (upperLeft / lowerRight)
            let ul = L.latLng([lat + halfCell, lon - halfCell]);
            let lr = L.latLng([lat - halfCell, lon + halfCell]);

            // not in bounds?
            let cellBounds = L.latLngBounds(
                L.latLng(lr.lat, ul.lng), L.latLng(ul.lat, lr.lng));
            if (!viewInfo.bounds.contains(cellBounds)) {
                continue;
            }

            // rectangle drawing
            let pixel_ul = viewInfo.layer._map.latLngToContainerPoint(ul);
            let pixel_lr = viewInfo.layer._map.latLngToContainerPoint(lr);
            let width = Math.abs(pixel_ul.x - pixel_lr.x);
            let height = Math.abs(pixel_ul.y - pixel_lr.y);

            // color
            g.fillStyle = 'blue'; //this.options.color(value); //TODO
            //g.fillStyle = this.options.color(value);
            g.fillRect(pixel_ul.x, pixel_ul.y, width, height);
        }
        console.timeEnd('onDrawLayer');
    },

    getBounds: function () {
        let bb = this.field.extent();
        let southWest = L.latLng(bb[1], bb[0]),
            northEast = L.latLng(bb[3], bb[2]);
        let bounds = L.latLngBounds(southWest, northEast);
        return bounds;
    },

    getPixel: function (x, y) {
        let ctx = this._canvas.getContext('2d');
        let pixel = ctx.getImageData(x, y, 1, 1);
        // array [r, g, b, a]
        return pixel;
    },

    _activateClick: function () {
        this._map.getContainer().style.cursor = 'default';
    },

    _queryValue: function (e) {
        let lon = e.latlng.lng;
        let lat = e.latlng.lat;
        let result = {
            latlng: e.latlng,
            value: this.field.valueAt(lon, lat)
        };
        this.fireEvent('click', result); /*includes: L.Mixin.Events,*/
    }
});

L.canvasLayer.scalarField = function (scalarField, options) {
    return new L.CanvasLayer.ScalarField(scalarField, options);
}
