/**
 * Abstract class for a Field layer on canvas, aka 'a Raster layer'
 * (ScalarField or a VectorField)
 */
L.CanvasLayer.Field = L.CanvasLayer.extend({

    options: {
        click: true, // 'onclick' event enabled
        pointerOnHover: false
    },

    initialize: function (field, options) {
        this.field = field;
        L.Util.setOptions(this, options);
    },

    onLayerDidMount: function () {
        if (this.options.click) {
            this._map.on('click', this._queryValue, this);
        }
        if (this.options.pointerOnHover) {
            this._map.on('mousemove', this._showPointerOnValue, this);
        }
    },

    onLayerWillUnmount: function () {
        if (this.options.click) {
            this._map.off('click', this._queryValue, this);
        }
        if (this.options.pointerOnHover) {
            this._map.off('mousemove', this._showPointerOnValue, this);
        }
    },

    onDrawLayer: function (viewInfo) {
        throw new TypeError('Must be overriden');
    },

    setData: function (data) {
        // -- custom data set
        // TODO
        this.needRedraw(); // -- call to drawLayer
    },

    getBounds: function () {
        let bb = this.field.extent();
        let southWest = L.latLng(bb[1], bb[0]),
            northEast = L.latLng(bb[3], bb[2]);
        let bounds = L.latLngBounds(southWest, northEast);
        return bounds;
    },

    _showPointerOnValue: function (e) {
        let lon = e.latlng.lng;
        let lat = e.latlng.lat;

        if (this.field.hasValueAt(lon, lat)) {
            this._map.getContainer().style.cursor = 'pointer';
        } else {
            this._map.getContainer().style.cursor = 'default';
        }
    },

    _queryValue: function (e) {
        let lon = e.latlng.lng;
        let lat = e.latlng.lat;
        let result = {
            latlng: e.latlng,
            value: this.field.valueAt(lon, lat)
        };
        this.fireEvent('click', result); /*includes: L.Mixin.Events,*/
    },

    /**
     * Get clean context to draw on canvas
     * @returns {CanvasRenderingContext2D}
     */
    _getDrawingContext: function () {
        let g = this._canvas.getContext('2d');
        g.clearRect(0, 0, this._canvas.width, this._canvas.height);
        return g;
    }

});
