CapaPuntos = function (lonslats, color = "rgba(255, 255, 255, 1)") {
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
        //g.strokeStyle = this.color; // html color code
        g.fillStyle = this.color; // "rgba(255, 255, 255, 1)";

        let ptos = this.lonslats;

        for (var i = 0; i < ptos.length; i++) {
            let lonlat = ptos[i];
            let x = lonlat[0];
            let y = lonlat[1];

            let p = viewInfo.layer._map.latLngToContainerPoint([y, x]);
            g.beginPath();
            //g.arc(p.x, p.y, 0.01, 0, Math.PI * 2); // circulo
            g.fillRect(p.x, p.y, 1, 1); // punto
            g.fill();
            g.closePath();
            g.stroke();
        }
    }
}

CapaPuntos.prototype = new L.CanvasLayer();
