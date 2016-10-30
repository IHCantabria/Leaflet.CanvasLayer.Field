/**
 * Abstract class for a Field layer on canvas, aka "a Raster layer"
 * (ScalarField or a VectorField)

L.CanvasLayer.Field = L.CanvasLayer.extend({
    options: {
        click: true, // 'click' event
    },

    initialize: function (field, options) {
        // TODO protect against direct instantiation!!

        this.field = field;
        L.Util.setOptions(this, options);
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
        throw new TypeError("Must be overriden");
    },

    getBounds: function () {
        let bb = this.field.extent();
        let southWest = L.latLng(bb[1], bb[0]),
            northEast = L.latLng(bb[3], bb[2]);
        let bounds = L.latLngBounds(southWest, northEast);
        return bounds;
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
        this.fireEvent('click', result); //includes: L.Mixin.Events

}
});
*/
