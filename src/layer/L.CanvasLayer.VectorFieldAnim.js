/**
 * Animated VectorField on canvas
 */
L.CanvasLayer.VectorFieldAnim = L.CanvasLayer.extend({
    options: {
        paths: 1000,
        color: "white", // html-color | chromajs.scale
        width: 2, // path-width
        fade: "0.96", // 0 to 1
        click: true, // 'click' event
        duration: 40, // milliseconds per 'frame'
        maxAge: 200, // number of maximum frames per path
        velocityScale: 1 / 1000
    },

    initialize: function (vectorField, options) {
        this.field = vectorField;
        this.timer = null;
        L.Util.setOptions(this, options);
    },

    onLayerDidMount: function () {
        if (this.options.click) {
            this._map.on('mouseover', this._activateClick, this);
            this._map.on('click', this._queryValue, this);
        }
        this._map.on('movestart resize', this._stopAnimation, this);
    },

    onLayerWillUnmount: function () {
        if (this.options.click) {
            this._map.off('mouseover', this._activateClick, this);
            this._map.off('click', this._queryValue, this);
        }
        this._map.off('movestart resize', this._stopAnimation, this);
    },

    setData: function (data) {
        // -- custom data set
        // TODO
        this.needRedraw(); // -- call to drawLayer
    },

    onDrawLayer: function (viewInfo) {
        // canvas preparation
        let g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);

        // fading paths...
        g.fillStyle = `rgba(125, 255, 0, ${this.options.fade})`;
        g.lineWidth = this.options.width;
        g.strokeStyle = this.options.color;

        // particle paths preparation
        let paths = [];

        for (var i = 0; i < this.options.paths; i++) {
            let p = this.field.randomPosition();
            p.age = this._randomAge();
            paths.push(p)
        }

        this.timer = d3.timer(function () {
            moveParticles();
            drawParticles();
        }, this.options.duration);

        let self = this;

        /**
         * Builds the paths, adding 'particles' on each animation step, considering
         * their properties (age / position source > target)
         */
        function moveParticles() {
            paths.forEach(function (par) {
                if (par.age > self.options.maxAge) {
                    // restart, on a random x,y
                    par.age = 0;
                    self.vf.randomPosition(par);
                }

                if (self.vf.notHasValuesAt(par.x, par.y)) {
                    par.age = self.options.maxAge;
                } else {
                    // has a vector...
                    let vector = self.vf.valueAt(par.x, par.y);
                    // ... and the next point will be...
                    let xt = par.x + (vector.u * self.options.velocityScale);
                    let yt = par.y + (vector.v * self.options.velocityScale);

                    if (self.vf.hasValueAt(xt, yt)) {
                        par.xt = xt;
                        par.yt = yt;
                        par.m = vector.magnitude();
                    } else {
                        // not visible... keep moving?
                        par.age = self.options.maxAge; // ??
                    }
                }
                par.age += 1;
            });
        }

        /**
         * Draws the paths on each step
         */
        function drawParticles() {
            // Previous paths...
            g.globalCompositeOperation = "destination-in";
            g.fillRect(0, 0, g.canvas.width, g.canvas.height);
            g.globalCompositeOperation = "source-over";

            // New paths
            paths.forEach(function (par) {
                let source = new L.latLng(par.y, par.x);
                let target = new L.latLng(par.yt, par.xt);

                if (viewInfo.bounds.contains(source) && par.age <= self.options.maxAge) {
                    let pA = viewInfo.layer._map.latLngToContainerPoint(source);
                    let pB = viewInfo.layer._map.latLngToContainerPoint(target);

                    g.beginPath();
                    g.moveTo(pA.x, pA.y);
                    g.lineTo(pB.x, pB.y);

                    // next-step movement
                    par.x = par.xt;
                    par.y = par.yt;

                    // colormap vs. simple color
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
        let bb = this.field.extent();
        let southWest = L.latLng(bb[1], bb[0]),
            northEast = L.latLng(bb[3], bb[2]);
        let bounds = L.latLngBounds(southWest, northEast);
        return bounds;
    },

    _randomAge: function () {
        return Math.round(Math.random() * this.options.maxAge);
    },

    _stopAnimation: function () {
        if (this.timer) {
            this.timer.stop();
        }
    },

    _activateClick: function () {
        this._map.getContainer().style.cursor = 'default';
    },

    _queryValue: function (e) {
        let lon = e.latlng.lng;
        let lat = e.latlng.lat;
        let result = {
            "latlng": e.latlng,
            "value": this.field.valueAt(lon, lat)
        };

        this.fireEvent('click', result); /*includes: L.Mixin.Events,*/
    }
});

L.canvasLayer.vectorFieldAnim = function (vectorField, options) {
    return new L.CanvasLayer.VectorFieldAnim(vectorField, options);
}
