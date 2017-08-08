/**
 * Animated VectorField on canvas
 */
L.CanvasLayer.VectorFieldAnim = L.CanvasLayer.Field.extend({
    options: {
        paths: 800,
        color: 'white', // html-color | function colorFor(value) [e.g. chromajs.scale]
        width: 1.0, // number | function widthFor(value)
        fade: 0.96, // 0 to 1
        duration: 20, // milliseconds per 'frame'
        maxAge: 200, // number of maximum frames per path
        velocityScale: 1 / 5000
    },

    initialize: function(vectorField, options) {
        L.CanvasLayer.Field.prototype.initialize.call(
            this,
            vectorField,
            options
        );
        L.Util.setOptions(this, options);

        this.timer = null;
    },

    onLayerDidMount: function() {
        L.CanvasLayer.Field.prototype.onLayerDidMount.call(this);
        this._map.on('move resize', this._stopAnimation, this);
    },

    onLayerWillUnmount: function() {
        L.CanvasLayer.Field.prototype.onLayerWillUnmount.call(this);
        this._map.off('move resize', this._stopAnimation, this);
        this._stopAnimation();
    },

    _hideCanvas: function _showCanvas() {
        L.CanvasLayer.Field.prototype._hideCanvas.call(this);
        this._stopAnimation();
    },

    onDrawLayer: function(viewInfo) {
        if (!this._field || !this.isVisible()) return;

        this._updateOpacity();

        let ctx = this._getDrawingContext();
        let paths = this._prepareParticlePaths();

        this.timer = d3.timer(function() {
            _moveParticles();
            _drawParticles();
        }, this.options.duration);

        let self = this;

        /**
         * Builds the paths, adding 'particles' on each animation step, considering
         * their properties (age / position source > target)
         */
        function _moveParticles() {
            // let screenFactor = 1 / self._map.getZoom(); // consider using a 'screenFactor' to ponderate velocityScale
            paths.forEach(function(par) {
                if (par.age > self.options.maxAge) {
                    // restart, on a random x,y
                    par.age = 0;
                    self._field.randomPosition(par);
                }

                let vector = self._field.valueAt(par.x, par.y);
                if (vector === null) {
                    par.age = self.options.maxAge;
                } else {
                    // the next point will be...
                    let xt = par.x + vector.u * self.options.velocityScale; //* screenFactor;
                    let yt = par.y + vector.v * self.options.velocityScale; //* screenFactor;

                    if (self._field.hasValueAt(xt, yt)) {
                        par.xt = xt;
                        par.yt = yt;
                        par.m = vector.magnitude();
                    } else {
                        // not visible anymore...
                        par.age = self.options.maxAge;
                    }
                }
                par.age += 1;
            });
        }

        /**
         * Draws the paths on each step
         */
        function _drawParticles() {
            // Previous paths...
            let prev = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = 'destination-in';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            //ctx.globalCompositeOperation = 'source-over';
            ctx.globalCompositeOperation = prev;

            // fading paths...
            ctx.fillStyle = `rgba(0, 0, 0, ${self.options.fade})`;
            ctx.lineWidth = self.options.width;
            ctx.strokeStyle = self.options.color;

            // New paths
            paths.forEach(function(par) {
                self._drawParticle(viewInfo, ctx, par);
            });
        }
    },

    _drawParticle(viewInfo, ctx, par) {
        let source = new L.latLng(par.y, par.x);
        let target = new L.latLng(par.yt, par.xt);

        if (
            viewInfo.bounds.contains(source) &&
            par.age <= this.options.maxAge
        ) {
            let pA = viewInfo.layer._map.latLngToContainerPoint(source);
            let pB = viewInfo.layer._map.latLngToContainerPoint(target);

            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);

            // next-step movement
            par.x = par.xt;
            par.y = par.yt;

            // colormap vs. simple color
            let color = this.options.color;
            if (typeof color === 'function') {
                ctx.strokeStyle = color(par.m);
            }

            let width = this.options.width;
            if (typeof width === 'function') {
                ctx.lineWidth = width(par.m);
            }

            ctx.stroke();
        }
    },

    _prepareParticlePaths: function() {
        let paths = [];

        for (var i = 0; i < this.options.paths; i++) {
            let p = this._field.randomPosition();
            p.age = this._randomAge();
            paths.push(p);
        }
        return paths;
    },

    _randomAge: function() {
        return Math.floor(Math.random() * this.options.maxAge);
    },

    _stopAnimation: function() {
        if (this.timer) {
            this.timer.stop();
        }
    }
});

L.canvasLayer.vectorFieldAnim = function(vectorField, options) {
    return new L.CanvasLayer.VectorFieldAnim(vectorField, options);
};
