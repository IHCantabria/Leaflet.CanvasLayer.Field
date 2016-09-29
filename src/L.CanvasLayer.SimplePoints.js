/**
 *  Simple lon-lat points layer with a color
 */
L.CanvasLayer.SimplePoints = L.CanvasLayer.extend({
    options: {
        color: "gray", // TODO: html-color | chromajs.scale
        /*grosor: 2,
        click: true // generar evento 'click_vector'*/
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
            let x = lonlat[0];
            let y = lonlat[1];

            let p = viewInfo.layer._map.latLngToContainerPoint([y, x]);
            g.beginPath();
            //g.arc(p.x, p.y, 0.01, 0, Math.PI * 2); // circle
            g.fillRect(p.x, p.y, 1, 1); // point
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

        let southWest = L.latLng(xmin, ymin),
            northEast = L.latLng(xmax, ymax);
        let bounds = L.latLngBounds(southWest, northEast); // TODO FIX ERROR
        return bounds;
    }
});

L.canvasLayer.simplePoints = function (lonslats, options) {
    return new L.CanvasLayer.SimplePoints(lonslats, options);
}
