CapaVectorAnimado = function (campoVectorial, opciones = {}) {
    this.cv = campoVectorial;
    let opcionesPorDefecto = {
        trayectorias: 2000,
        duracion: 40, // milisegundos - 'frame'
        edadMaxima: 1000,
        color: "white", // html-color o chromajs.scale
        grosor: 2
    };

    console.log('Rangos corrientes', this.cv.rangoMagnitud());

    this.opciones = _.defaults(opciones, opcionesPorDefecto);
    this.timer = null;
    let self = this;

    this.onLayerDidMount = function () {
        // -- prepare custom drawing
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
        g.lineWidth = this.opciones.grosor;
        g.strokeStyle = this.opciones.color;

        // preparación de trayectorias de partículas
        let trayectorias = [];

        for (var i = 0; i < this.opciones.trayectorias; i++) {
            let p = self.cv.posicionAleatoria();
            p.edad = this._edadAleatoria();
            trayectorias.push(p)
        }

        this.timer = d3.timer(function () {
            moverParticulas();
            dibujar();
        }, this.opciones.duracion);


        /**
         * Construye las trayectorias de las partículas, modificando a cada paso temporal
         * sus características (edad / posición origen > destino)
         */
        function moverParticulas() {
            trayectorias.forEach(function (par) {
                if (par.edad > self.opciones.edadMaxima) {
                    //se inicia de nuevo, en una posición x|y aleatoria
                    par.edad = 0;
                    self.cv.posicionAleatoria(par);
                }

                if (self.cv.noTieneValorEn(par.x, par.y)) {
                    par.edad = self.opciones.edadMaxima;
                } else {
                    // tiene vector...
                    let uv = self.cv.valorEn(par.x, par.y);
                    let vector = new Vector(uv[0], uv[1]);
                    // ... y el siguiente punto sería
                    let xt = par.x + (vector.u * self.cv.dx);
                    let yt = par.y + (vector.v * self.cv.dy);
                    let m = vector.longitud(); //magnitud en unidades de entrada (m/s?)

                    if (self.cv.tieneValorEn(xt, yt)) {
                        par.xt = xt;
                        par.yt = yt;
                        par.m = m;
                    } else {
                        // no visible... continuar moviendo?
                        par.edad = self.opciones.edadMaxima; // ??
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

                if (viewInfo.bounds.contains(origen) && par.edad <= self.opciones.edadMaxima) {
                    let ptoA = viewInfo.layer._map.latLngToContainerPoint(origen);
                    let ptoB = viewInfo.layer._map.latLngToContainerPoint(destino);

                    g.beginPath();
                    g.moveTo(ptoA.x, ptoA.y);
                    g.lineTo(ptoB.x, ptoB.y);

                    // movimiento para siguiente paso
                    par.x = par.xt;
                    par.y = par.yt;

                    // color personalizado por intensidad, si procede
                    let color = self.opciones.color;
                    if (typeof color == 'function') {
                        g.strokeStyle = color(par.m).hex();
                    }
                    g.stroke();
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
        return Math.round(Math.random() * this.opciones.edadMaxima);
    }
}

CapaVectorAnimado.prototype = new L.CanvasLayer();
