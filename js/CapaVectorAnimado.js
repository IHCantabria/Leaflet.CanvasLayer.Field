 CapaVectorAnimado = function (ptos) {
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
         let g = viewInfo.canvas.getContext('2d');
         g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);
         g.fillStyle = "rgba(255, 0, 0, 0.01)"; // for fading curves
         g.lineWidth = 0.7;
         g.strokeStyle = "#FF8000"; // html color code
         g.globalCompositeOperation = "source-over";

         // Preparación de animación
         // let puntosGraficar = this.ptos; TODOS
         let puntosGraficar = this.ptos.filter(function (e, index, arr) {
             if (index % 5 === 0) return e;
         });


         let animAge = 0, // edad inicial
             frameRate = 40, // ms por cada paso temporal o 'frame'
             M = puntosGraficar.length,
             MaxAge = 100, // # edad máxima (timesteps before restart)
             edad = [];

         // localizaciones iniciales
         let X0 = [],
             Y0 = [];
         // posición actual para cada curva
         let X = [],
             Y = [];

         /*         for (var i = 0; i < M; i++) {
                      edad.push(this._edadAleatoria());
                  }
         */

         d3.timer(function () {
             moverParticulas();
             dibujar();
         }, frameRate);

         var particulas = []; // ¿?

         function moverParticulas() {
             particulas = puntosGraficar.map(function (el) {
                 return el;
             });
         }

         function dibujar() {
             //
             g.globalCompositeOperation = "destination-in";
             g.fillRect(0, 0, g.canvas.width, g.canvas.height);
             g.globalCompositeOperation = "source-over";

             const ANCHO = 0.0005; //paso de malla (lon|lat)

             particulas.forEach(function (pto) {
                 /*
                 - ¿qué pintar?
                    >> inicialmente, una línea iniciada en TODAS las celdas
                    >> más adelante crear "particulas" (sólo un número "razonable")

                - ¿dónde empezar?
                    >> inicialmente, empezar siempre en el punto "inicio" de la celda (no hay desplazamiento)
                    >> más adelante, trazar una trayectoria donde el pto. inicial va siendo en cada paso el final del pintado previo

                - ¿en qué dirección pìntar?
                    >> inicialmente, la indicada por el vector en cada celda "inicio"
                    >> más adelante, la dirección del punto de la celda en la que cae, o una dirección interpolada basada en varias celdas!!

                -  ¿cuánta longitud?
                    >> un valor fijo!??
                    >> la determinada por el vector???

                -  ¿de qué color pintar?
                    >> primero usar un color fijo de línea
                    >> más adelante, considerar un color ligado a magnitud del vector

                     */

                 let origen = pto.latlng;

                 //let destino = [origen.lon += ]
                 let destino = L.GeometryUtil.destination(origen, pto.dir, 100); // línea n metros

                 if (viewInfo.bounds.contains(origen)) {
                     let ptoA = viewInfo.layer._map.latLngToContainerPoint(origen);
                     let ptoB = viewInfo.layer._map.latLngToContainerPoint(destino);

                     g.beginPath();
                     g.moveTo(ptoA.x, ptoA.y);
                     g.lineTo(ptoB.x, ptoB.y);

                     g.stroke();

                     /* Pinta el punto
                     g.arc(origen.x, origen.y, 3, 0, Math.PI * 2);
                     g.fill();
                     g.closePath();
                     */
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


     /* Valores [u,v,magnitud] en un punto concreto
     function field(x, y) {
            var column = columns[Math.round(x)];
            return column && column[Math.round(y)] || NULL_WIND_VECTOR;
        }
     */
 }

 CapaVectorAnimado.prototype = new L.CanvasLayer(); // -- setup prototype
