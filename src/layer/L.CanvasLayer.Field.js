/**
 * Abstract class for a Field layer on canvas, aka 'a Raster layer'
 * (ScalarField or a VectorField)
 */
L.CanvasLayer.Field = L.CanvasLayer.extend({
    options: {
        mouseMoveCursor: {
            value: 'pointer',
            noValue: 'default'
        },
        opacity: 1,
        onClick: null,
        onMouseMove: null,
        inFilter: null
    },

    initialize: function(field, options) {
        L.Util.setOptions(this, options);
        this._visible = true;
        if (field) {
            this.setData(field);
        }
    },

    getEvents: function() {
        var events = L.CanvasLayer.prototype.getEvents.call(this);
        events.zoomstart = this._hideCanvas.bind(this);
        events.zoomend = this._showCanvas.bind(this);
        return events;
    },

    onLayerDidMount: function() {
        this._enableIdentify();
        this._ensureCanvasAlignment();
    },

    show() {
        this._visible = true;
        this._showCanvas();
        this._enableIdentify();
    },

    hide() {
        this._visible = false;
        this._hideCanvas();
        this._disableIdentify();
    },

    isVisible() {
        return this._visible;
    },

    _showCanvas() {
        if (this._canvas && this._visible) {
            this._canvas.style.visibility = 'visible';
        }
    },

    _hideCanvas() {
        if (this._canvas) {
            this._canvas.style.visibility = 'hidden';
        }
    },

    _enableIdentify() {
        this._map.on('click', this._onClick, this);
        this._map.on('mousemove', this._onMouseMove, this);

        this.options.onClick && this.on('click', this.options.onClick, this);
        this.options.onMouseMove &&
            this.on('mousemove', this.options.onMouseMove, this);
    },

    _disableIdentify() {
        this._map.off('click', this._onClick, this);
        this._map.off('mousemove', this._onMouseMove, this);

        this.options.onClick && this.off('click', this.options.onClick, this);
        this.options.onMouseMove &&
            this.off('mousemove', this.options.onMouseMove, this);
    },

    _ensureCanvasAlignment() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
    },

    onLayerWillUnmount: function() {
        this._disableIdentify();
    },

    needRedraw() {
        if (this._map && this._field) {
            L.CanvasLayer.prototype.needRedraw.call(this);
        }
    },

    /* eslint-disable no-unused-vars */
    onDrawLayer: function(viewInfo) {
        throw new TypeError('Must be overriden');
    },
    /* eslint-enable no-unused-vars */

    setData: function(field) {
        this.options.inFilter && field.setFilter(this.options.inFilter);
        this._field = field;
        this.needRedraw();
        this.fire('load');
    },

    setFilter: function(f) {
        this.options.inFilter = f;
        this._field && this._field.setFilter(f);
        this.needRedraw();
    },

    setOpacity: function(opacity) {
        this.options.opacity = opacity;

        if (this._canvas) {
            this._updateOpacity();
        }
        return this;
    },

    getBounds: function() {
        let bb = this._field.extent();

        let southWest = L.latLng(bb[1], bb[0]),
            northEast = L.latLng(bb[3], bb[2]);
        let bounds = L.latLngBounds(southWest, northEast);
        return bounds;
    },

    _onClick: function(e) {
        let v = this._queryValue(e);
        this.fire('click', v);
    },

    _onMouseMove: function(e) {
        let v = this._queryValue(e);
        this._changeCursorOn(v);
        this.fire('mousemove', v);
    },

    _changeCursorOn: function(v) {
        if (!this.options.mouseMoveCursor) return;

        let { value, noValue } = this.options.mouseMoveCursor;
        let style = this._map.getContainer().style;
        style.cursor = v.value !== null ? value : noValue;
    },

    _updateOpacity: function() {
        L.DomUtil.setOpacity(this._canvas, this.options.opacity);
    },

    _queryValue: function(e) {
        let v = this._field
            ? this._field.valueAt(e.latlng.lng, e.latlng.lat)
            : null;
        let result = {
            latlng: e.latlng,
            value: v
        };
        return result;
    },

    _getDrawingContext: function() {
        let g = this._canvas.getContext('2d');
        g.clearRect(0, 0, this._canvas.width, this._canvas.height);
        return g;
    }
});
