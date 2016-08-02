 CapaSimple = function (ptos) {
     this.ptos = ptos;

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
         var ctx = viewInfo.canvas.getContext('2d');
         ctx.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
         ctx.fillStyle = "rgba(255,255,0, 0.4)";

         this.ptos.forEach(function (pto) {
             let latlng = pto.latlng;
             if (viewInfo.bounds.contains(latlng)) {
                 dot = viewInfo.layer._map.latLngToContainerPoint(latlng);
                 ctx.beginPath();
                 ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
                 ctx.fill();
                 ctx.closePath();
             }
         });
     }
 }

 CapaSimple.prototype = new L.CanvasLayer(); // -- setup prototype
