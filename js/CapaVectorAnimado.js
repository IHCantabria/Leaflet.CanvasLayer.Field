CapaVectorAnimado = function (campoVectorial) {
    this.campoVectorial = campoVectorial;
    this.timer = null;

    this.onLayerDidMount = function () {
        // -- prepare custom drawing
        let self = this;
        this._map.on('movestart', function (e) {
            if (self.timer) self.timer.stop();
        });
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

        // caracterìsticas de pintado de trayectorias que se desvanecen
        g.fillStyle = "rgba(0, 0, 0, 0.97)";
        g.lineWidth = 2;
        g.strokeStyle = "cyan"; // html color code

        // preparación de trayectorias de partículas
        let cv = this.campoVectorial;
        let trayectorias = [];

        for (var i = 0; i < CapaVectorAnimado.NUMERO_TRAYECTORIAS; i++) {
            let p = cv.posicionAleatoria();
            p.edad = this._edadAleatoria();
            trayectorias.push(p)
        }

        this.timer = d3.timer(function () {
            moverParticulas();
            dibujar();
        }, CapaVectorAnimado.DURACION_FRAME);


        /**
         * Construye las trayectorias de las partículas, modificando a cada paso temporal
         * sus características (edad / posición origen > destino)
         */
        function moverParticulas() {
            trayectorias.forEach(function (par) {
                if (par.edad > CapaVectorAnimado.EDAD_MAXIMA_PARTICULA) {
                    //se inicia de nuevo, en una posición x|y aleatoria
                    par.edad = CapaVectorAnimado.EDAD_INICIAL_PARTICULA;
                    cv.posicionAleatoria(par);
                }

                if (cv.noTieneValorEn(par.x, par.y)) {
                    par.edad = CapaVectorAnimado.EDAD_MAXIMA_PARTICULA;
                } else {
                    // tiene vector...
                    let uv = cv.valorEn(par.x, par.y);
                    let vector = new Vector(uv[0], uv[1]);
                    // ... y el siguiente punto sería
                    let xt = par.x + (vector.u * cv.dx);
                    let yt = par.y + (vector.v * cv.dy);

                    if (cv.tieneValorEn(xt, yt)) {
                        par.xt = xt;
                        par.yt = yt;
                    } else {
                        // no visible...? continuar moviendo ??? TODO
                        par.edad = CapaVectorAnimado.EDAD_MAXIMA_PARTICULA; // ??
                    }
                }
                par.edad += 1;
            });
        }

        /**
         * Pinta las partículas en el canvas
         */
        function dibujar() {
            // Desvanecer trayectorias previas
            g.globalCompositeOperation = "destination-in";
            g.fillRect(0, 0, g.canvas.width, g.canvas.height);
            g.globalCompositeOperation = "source-over";

            // Dibujar nuevas
            trayectorias.forEach(function (par) {
                let origen = new L.latLng(par.y, par.x);
                let destino = new L.latLng(par.yt, par.xt);

                if (viewInfo.bounds.contains(origen) && par.edad <= CapaVectorAnimado.EDAD_MAXIMA_PARTICULA) {
                    let ptoA = viewInfo.layer._map.latLngToContainerPoint(origen);
                    let ptoB = viewInfo.layer._map.latLngToContainerPoint(destino);

                    g.beginPath();
                    g.moveTo(ptoA.x, ptoA.y);
                    g.lineTo(ptoB.x, ptoB.y);

                    // movimiento para siguiente paso
                    par.x = par.xt;
                    par.y = par.yt;
                    g.stroke(); // TODO. 1 llamada vs. varias... rendimiento?
                }
            });
        }
    };


    /**
     * Edad aleatoria en cada curva dibujada
     * @private
     * @returns {[[Type]]} [[Description]]
     */
    this._edadAleatoria = function () {
        return Math.round(Math.random() * CapaVectorAnimado.EDAD_MAXIMA_PARTICULA);
    }
}

CapaVectorAnimado.prototype = new L.CanvasLayer();

// Característicias generales de la animación
CapaVectorAnimado.NUMERO_TRAYECTORIAS = 1000;
CapaVectorAnimado.EDAD_INICIAL_PARTICULA = 0;
CapaVectorAnimado.DURACION_FRAME = 40; // milisegundos de cada 'frame' en la animación
CapaVectorAnimado.EDAD_MAXIMA_PARTICULA = 1000;
