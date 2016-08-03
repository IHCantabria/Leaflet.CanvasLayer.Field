 CapaVectorAnimado = function (ptos) {
     // Característicias generales de la animación
     const NUMERO_TRAYECTORIAS = 50,
         EDAD_INICIAL_PARTICULA = 0,
         DURACION_FRAME = 40, // milisegundos de cada 'frame' en la animación
         EDAD_MAXIMA_PARTICULA = 100;


     const PASO_MALLA = 0.0005;


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
         // preparación del canvas
         let g = viewInfo.canvas.getContext('2d');
         g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);

         // caracterìsticas de pintado de líneas
         g.fillStyle = "rgba(255, 0, 0, 0.01)"; // for fading curves
         g.lineWidth = 0.7;
         g.strokeStyle = "#FF8000"; // html color code

         // selección de partículas
         // let puntosGraficar = this.ptos; TODOS
         let particulas = this.ptos.filter(function (e, index, arr) {
             // habría que aplicar una distribución seleccionando N PARTICULAS, 100-1000?????
             // ¿con una posición random?
             if (index % 5 === 0) {
                 let p = e; // inicialmente le adjudicamos todo el pto (más adelante, solo posición??? muy condicionado a estructura del campovectorial)
                 //p.edad = EDAD_INICIAL_PARTICULA; //??
                 p.edad = Math.floor((Math.random() * 100) + 1); //vida 1 a 100

                 return p;
             }
         });

         let particulasPintar = []; //buckets?

         d3.timer(function () {
             moverParticulas();
             dibujar();
         }, DURACION_FRAME);


         /**
          * Construye las trayectorias de las partículas, modificando a cada paso temporal
          * sus características (edad / posición origen > destino)
          */
         function moverParticulas() {
             particulas.forEach(function (par) {
                 if (par.edad > EDAD_MAXIMA_PARTICULA) {
                     par.edad = EDAD_INICIAL_PARTICULA; // mismo sitio, comienza de nuevo
                     // en earth se le randomiza la posición x|y para que empiece en otro sitio
                 }
                 // datos en 'ubicación actual'
                 var x = par.lon;
                 var y = par.lat;
                 var u = par.u;
                 var v = par.v;
                 var m = par.m;

                 // siguiente punto
                 var xt = x + u * PASO_MALLA * 5;
                 var yt = y + v * PASO_MALLA * 5;


                 // ¿particula visible / no visible? | ¿bordes?
                 par.latlngT = new L.latLng(yt, xt);
                 /*par.lont = xt;
                 par.latt = yt;*/
                 par.edad += 1;

                 particulasPintar.push(par);
             });
         }

         /**
          * Pinta las partículas en el canvas
          */
         function dibujar() {
             //
             g.globalCompositeOperation = "destination-in";
             g.fillRect(0, 0, g.canvas.width, g.canvas.height);
             g.globalCompositeOperation = "source-over";

             const ANCHO = 0.0005; //paso de malla (lon|lat)

             particulasPintar.forEach(function (par) {
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

                 let origen = par.latlng;
                 //let origen = [par.lat, par.lon];

                 //let destino = [origen.lon += ]
                 // let destino = L.GeometryUtil.destination(origen, par.dir, 100); // línea n metros
                 let destino = par.latlngT;

                 // grafica lo que está en pantalla...
                 // ... y tiene "vida"
                 if (viewInfo.bounds.contains(origen) && par.edad <= EDAD_MAXIMA_PARTICULA) {
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
