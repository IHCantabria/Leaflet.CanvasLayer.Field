/**
 * ScalarField ('Raster') on canvas
 */
L.CanvasLayer.ScalarField = L.CanvasLayer.extend({
    options: {
        click: true, // 'click_vector' event
        color: "yellow"
    },

    initialize: function (scalarField, options) {
        this.sf = scalarField;
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
        // canvas preparation
        let g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
        g.fillStyle = this.options.color;

        let cells = this.sf.gridLonLatValue();
        let halfPixel = this.sf.cellsize;
        for (var i = 0; i < cells.length; i++) {
            let lonlat = cells[i];
            let ll = viewInfo.layer._map.latLngToContainerPoint([lonlat[1] - halfPixel, lonlat[0] - halfPixel]);
            let ur = viewInfo.layer._map.latLngToContainerPoint([lonlat[1] + halfPixel, lonlat[0] + halfPixel]);
            g.beginPath();
            //g.arc(p.x, p.y, 1, 0, Math.PI * 2); // circle | TODO style 'function' as parameter?

            let width = Math.abs(ll.x - ur.x);
            let height = Math.abs(ll.y - ur.y);

            g.fillRect(ll.x, ll.y, width, height);
            g.fill();
            g.closePath();
            g.stroke();
        }

    },


    getBounds: function () {
        let bb = this.sf.extent();
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
            "latlng": e.latlng,
            "vector": this.vf.valueAt(lon, lat)
        };

        this.fireEvent('click_vector', result); /*includes: L.Mixin.Events,*/
    }
});

L.canvasLayer.scalarField = function (scalarField, options) {
    return new L.CanvasLayer.ScalarField(scalarField, options);
}
