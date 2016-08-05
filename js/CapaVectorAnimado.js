CapaVectorAnimado = function (campoVectorial) {
    this.campoVectorial = campoVectorial;

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
        g.fillStyle = "rgba(255, 0, 0, 0.5)"; // for fading curves
        g.lineWidth = 0.7;
        g.strokeStyle = "#FF8000"; // html color code

        // selección de partículas
        // let puntosGraficar = this.ptos; TODOS
        let cv = this.campoVectorial;

        let inicioTrayectorias = [];
        for (var i = 0; i < CapaVectorAnimado.NUMERO_TRAYECTORIAS; i++) {
            let p = cv.posicionAleatoria();
            p.edad = CapaVectorAnimado.EDAD_INICIAL_PARTICULA;
            inicioTrayectorias.push(p)
        }

        d3.timer(function () {
            moverParticulas();
            dibujar();
        }, CapaVectorAnimado.DURACION_FRAME);

        let trayectorias = [];
        /**
         * Construye las trayectorias de las partículas, modificando a cada paso temporal
         * sus características (edad / posición origen > destino)
         */
        function moverParticulas() {
            inicioTrayectorias.forEach(function (par) {
                if (par.edad > CapaVectorAnimado.EDAD_MAXIMA_PARTICULA) {
                    par.edad = CapaVectorAnimado.EDAD_INICIAL_PARTICULA;
                    cv.posicionAleatoria(par);
                    // se inicia de nuevo, en una posición x|y aleatoria
                }

                if (cv.tieneValorEn(par.x, par.y)) {
                    // datos en 'ubicación actual'
                    let vector = cv.vectorEn(par.x, par.y);

                    // siguiente punto
                    var incx = cv.dx * 10;
                    var incy = cv.dy * 10;
                    let xt = par.x + vector.u * incx;
                    let yt = par.y + vector.v * incy;

                    // ¿particula visible / no visible? | ¿bordes?
                    par.xt = xt;
                    par.yt = yt; // new L.latLng(yt, xt);

                    trayectorias.push(par);
                } else {
                    par.edad = CapaVectorAnimado.EDAD_MAXIMA_PARTICULA; //
                }
                par.edad += 1;
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

            trayectorias.forEach(function (par) {
                /*
                 - ¿qué pintar?
                    >> inicialmente, una línea iniciada en TODAS las celdas
                    -- más adelante crear "trayectorias" (sólo un número "razonable")

                - ¿dónde empezar?
                    >> inicialmente, empezar siempre en el punto "inicio" de la celda (no hay desplazamiento)
                    >> más adelante, trazar una trayectoria donde el pto. inicial va siendo en cada paso el final del pintado previo

                - ¿en qué dirección pìntar?
                    >> inicialmente, la indicada por el vector en cada celda "inicio"
                    >> más adelante, la dirección del punto de la celda en la que cae, o una dirección interpolada basada en varias celdas!!

                -  ¿cuánta longitud?
                    - un valor fijo
                    >>> la determinada por el vector

                -  ¿de qué color pintar?
                    >> primero usar un color fijo de línea
                    - más adelante, considerar un color ligado a magnitud del vector

                */
                let origen = new L.latLng(par.y, par.x);

                //let destino = [origen.lon += ]
                // let destino = L.GeometryUtil.destination(origen, par.dir, 100); // línea n metros
                let destino = new L.latLng(par.yt, par.xt);

                // grafica lo que está en pantalla...
                // ... y tiene "vida"
                if (viewInfo.bounds.contains(origen) && par.edad <= CapaVectorAnimado.EDAD_MAXIMA_PARTICULA) {
                    let ptoA = viewInfo.layer._map.latLngToContainerPoint(origen);
                    let ptoB = viewInfo.layer._map.latLngToContainerPoint(destino);

                    g.beginPath();
                    g.moveTo(ptoA.x, ptoA.y);
                    g.lineTo(ptoB.x, ptoB.y);

                    par.x = par.xt; // movimiento al siguiente...
                    par.y = par.yt;
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

// Característicias generales de la animación
CapaVectorAnimado.NUMERO_TRAYECTORIAS = 500;
CapaVectorAnimado.EDAD_INICIAL_PARTICULA = 0;
CapaVectorAnimado.DURACION_FRAME = 40; // milisegundos de cada 'frame' en la animación
CapaVectorAnimado.EDAD_MAXIMA_PARTICULA = 100;
