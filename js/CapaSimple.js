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

         // Revisar... TODO
         //ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // for fading curves
         ctx.fillStyle = "rgba(255, 0, 0, 0.01)"; // for fading curves
         ctx.lineWidth = 0.7;
         ctx.strokeStyle = "#FF8000"; // html color code

         let puntosGraficar = this.ptos;
         // Preparación de animación
         var animAge = 0, // edad inicial
             frameRate = 30, // ms por cada paso temporal o 'frame'
             M = puntosGraficar.length,
             MaxAge = 100, // # edad máxima (timesteps before restart)
             edad = [];

         for (var i = 0; i < M; i++) {
             edad.push(this._edadAleatoria());
         }

         /* TODO: Revisar http://bl.ocks.org/newby-jay/767c5ffdbbe43b65902f
         para 'encender/apagar'
           var drawFlag = true;
           // setInterval(function () {if (drawFlag) {draw();}}, frameRate);
           d3.timer(function () {if (drawFlag) {draw();}}, frameRate);
           d3.select("#animation")
            .on("click", function() {drawFlag = (drawFlag) ? false : true;})
         */

         // animación continua...
         d3.timer(function () {
             dibujar();
         }, frameRate);

         function dibujar() {
             puntosGraficar.forEach(function (pto) {
                 let latlng = pto.latlng;
                 if (viewInfo.bounds.contains(latlng)) {
                     dot = viewInfo.layer._map.latLngToContainerPoint(latlng);
                     ctx.beginPath();
                     ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
                     ctx.fill();
                     ctx.closePath();
                 }
             });
             console.log('yap');
         }
     };


     /**
      * Edad aleatoria en cada curva dibujada
      * @private
      * @returns {[[Type]]} [[Description]]
      */
     this._edadAleatoria = function () {
         return Math.round(Math.random() * 100);
     }
 }

 CapaSimple.prototype = new L.CanvasLayer(); // -- setup prototype
