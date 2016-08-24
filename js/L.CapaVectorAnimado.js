/**
 *  Capa para crear una animación de un campo vectorial, usando el canvas
 */
L.CapaVectorAnimado = L.CanvasLayer.extend({
    options: {
        trayectorias: 3000,
        duracion: 40, // milisegundos - 'frame'
        edadMaxima: 1000,
        color: "white", // html-color | chromajs.scale
        grosor: 2,
        click: true // generar evento 'click_vector'
    },

    /*includes: L.Mixin.Events,*/

    initialize: function (campoVectorial, options) {
        this.cv = campoVectorial;
        this.timer = null;
        L.Util.setOptions(this, options);
    },

    onLayerDidMount: function () {
        this._map.on('movestart', this._detenerAnimacion, this);
        if (this.options.click) {
            this._map.on('mouseover', this._activarCursorClick, this);
            this._map.on('click', this._consultarValor, this);
        }
    },

    onLayerWillUnmount: function () {
        // -- custom cleanup
        this._map.off('movestart', this._detenerAnimacion, this);
        if (this.options.click) {
            this._map.off('mouseover', this._activarCursorClick, this);
            this._map.off('click', this._consultarValor, this);
        }
    },

    setData: function (data) {
        // -- custom data set
        this.needRedraw(); // -- call to drawLayer
    },

    onDrawLayer: function (viewInfo) {
        // preparación del canvas
        let g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);

        // caracterìsticas de pintado de trayectorias que se desvanecen
        g.fillStyle = "rgba(0, 0, 0, 0.97)";
        g.lineWidth = this.options.grosor;
        g.strokeStyle = this.options.color;

        // preparación de trayectorias de partículas
        let trayectorias = [];

        for (var i = 0; i < this.options.trayectorias; i++) {
            let p = this.cv.posicionAleatoria();
            p.edad = this._edadAleatoria();
            trayectorias.push(p)
        }

        this.timer = d3.timer(function () {
            moverParticulas();
            dibujar();
        }, this.options.duracion);

        let self = this;

        /**
         * Construye las trayectorias de las partículas, modificando a cada paso temporal
         * sus características (edad / posición origen > destino)
         */
        function moverParticulas() {
            trayectorias.forEach(function (par) {
                if (par.edad > self.options.edadMaxima) {
                    //se inicia de nuevo, en una posición x|y aleatoria
                    par.edad = 0;
                    self.cv.posicionAleatoria(par);
                }

                if (self.cv.noTieneValorEn(par.x, par.y)) {
                    par.edad = self.options.edadMaxima;
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
                        par.edad = self.options.edadMaxima; // ??
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

                if (viewInfo.bounds.contains(origen) && par.edad <= self.options.edadMaxima) {
                    let ptoA = viewInfo.layer._map.latLngToContainerPoint(origen);
                    let ptoB = viewInfo.layer._map.latLngToContainerPoint(destino);

                    g.beginPath();
                    g.moveTo(ptoA.x, ptoA.y);
                    g.lineTo(ptoB.x, ptoB.y);

                    // movimiento para siguiente paso
                    par.x = par.xt;
                    par.y = par.yt;

                    // color personalizado por intensidad, si procede
                    let color = self.options.color;
                    if (typeof color == 'function') {
                        g.strokeStyle = color(par.m).hex();
                    }
                    g.stroke();
                }
            });
        }
    },

    getBounds: function () {
        /*throw Error('SIN IMPLEMENTAR') // TODO <<<< BREAK:
        return this.cv.limites();*/
        return [];
    },

    _edadAleatoria: function () {
        return Math.round(Math.random() * this.options.edadMaxima);
    },

    _detenerAnimacion: function () {
        if (this.timer) this.timer.stop();
    },

    _activarCursorClick: function () {
        this._map.getContainer().style.cursor = 'default';
    },

    _consultarValor: function (e) {
        let lon = e.latlng.lng;
        let lat = e.latlng.lat;
        let uv = this.cv.valorEn(lon, lat);

        let resultado = {
            "latlng": e.latlng,
            "vector": null
        };

        if (uv !== null) resultado.vector = new Vector(uv[0], uv[1]);

        this.fireEvent('click_vector', resultado);
    }
});

L.capaVectorAnimado = function (campoVectorial, options) {
    return new L.CapaVectorAnimado(campoVectorial, options);
}
