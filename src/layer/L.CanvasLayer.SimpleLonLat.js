/**
 *  Simple layer with lon-lat points
 */
L.CanvasLayer.SimpleLonLat = L.CanvasLayer.extend({
    options: {
        color: 'gray'
    },

    initialize: function (lonslats, options) {
        this.lonslats = lonslats;
        L.Util.setOptions(this, options);
    },

    onLayerDidMount: function () {
        // -- prepare custom drawing
    },

    onLayerWillUnmount: function () {
        // -- custom cleanup
    },

    setData: function (data) {
        // -- custom data set
        this.needRedraw(); // -- call to drawLayer
    },

    onDrawLayer: function (viewInfo) {
        // canvas preparation
        let g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
        g.fillStyle = this.options.color;

        let ptos = this.lonslats;
        for (var i = 0; i < ptos.length; i++) {
            let lonlat = ptos[i];
            let p = viewInfo.layer._map.latLngToContainerPoint([lonlat.lat, lonlat.lon]);
            g.beginPath();
            //g.arc(p.x, p.y, 1, 0, Math.PI * 2); // circle | TODO style 'function' as parameter?
            g.fillRect(p.x, p.y, 2, 2); //simple point
            g.fill();
            g.closePath();
            g.stroke();
        }
    },

    getBounds: function () {
        let xs = this.lonslats.map(pt => pt.lon);
        let ys = this.lonslats.map(pt => pt.lat);

        let xmin = Math.min(...xs);
        let ymin = Math.min(...ys);
        let xmax = Math.max(...xs);
        let ymax = Math.max(...ys);

        let southWest = L.latLng(ymin, xmin),
            northEast = L.latLng(ymax, xmax);
        let bounds = L.latLngBounds(southWest, northEast); // TODO FIX ERROR ? hal-pix?
        return bounds;
    }
});

L.canvasLayer.simpleLonLat = function (lonslats, options) {
    return new L.CanvasLayer.SimpleLonLat(lonslats, options);
};
