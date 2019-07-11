/**
 *  Simple layer with lon-lat points
 *
 *  TODO rename to SimplePoint?
 */
L.CanvasLayer.SimpleLonLat = L.CanvasLayer.extend({
    options: {
        color: 'gray',
        size: 2
    },

    initialize: function(points, options) {
        this.points = points;
        L.Util.setOptions(this, options);
    },

    onLayerDidMount: function() {
        // -- prepare custom drawing
    },

    onLayerWillUnmount: function() {
        // -- custom cleanup
    },

    /* eslint-disable no-unused-vars */
    setData: function(data) {
        // -- custom data set
        this.needRedraw(); // -- call to drawLayer
    },
    /* eslint-enable no-unused-vars */

    onDrawLayer: function(viewInfo) {
        // canvas preparation
        let g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
        g.fillStyle = this.options.color;

        for (let point of this.points) {
            let p = viewInfo.layer._map.latLngToContainerPoint(point);
            g.beginPath();
            //g.arc(p.x, p.y, 1, 0, Math.PI * 2); // circle | TODO style 'function' as parameter?
            g.fillRect(p.x, p.y, this.options.size, this.options.size); //simple point
            g.fill();
            g.closePath();
            g.stroke();
        }
    },

    getBounds: function() {
        // TODO: bounding with points...
        let xs = this.points.map(pt => pt.lng);
        let ys = this.points.map(pt => pt.lat);

        let xmin = Math.min(...xs);
        let ymin = Math.min(...ys);
        let xmax = Math.max(...xs);
        let ymax = Math.max(...ys);

        let southWest = L.latLng(ymin, xmin),
            northEast = L.latLng(ymax, xmax);
        let bounds = L.latLngBounds(southWest, northEast); // TODO FIX ERROR ? half-pixel?
        return bounds;
    }
});

L.canvasLayer.simpleLonLat = function(lonslats, options) {
    return new L.CanvasLayer.SimpleLonLat(lonslats, options);
};
