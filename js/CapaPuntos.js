CapaPuntos = function (lonslats, color = "red") {
    this.lonslats = lonslats; // Array con puntos [lon, lat, xxxxx]
    this.color = color;

    this.onLayerDidMount = function () {
        // -- prepare custom drawing
    };
    this.onLayerWillUnmount = function () {
        // -- custom cleanup
    };

    this.setData = function (data) {
        // -- custom data set
        this.needRedraw(); // -- call to drawLayer
    };

    this.onDrawLayer = function (viewInfo) {
        // preparación del canvas
        let g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
        g.strokeStyle = this.color; // html color code

        let ptos = this.lonslats;

        for (var i = 0; i < ptos.length; i++) {
            let lonlat = ptos[i];
            let x = lonlat[0];
            let y = lonlat[1];

            let p = viewInfo.layer._map.latLngToContainerPoint([y, x]);
            g.beginPath();
            g.arc(p.x, p.y, 0.05, 0, Math.PI * 2);
            g.fill();
            g.closePath();
            g.stroke();
        }
    }
}

CapaPuntos.prototype = new L.CanvasLayer();
