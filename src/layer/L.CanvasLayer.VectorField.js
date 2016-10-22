/**
 * VectorField on canvas || TODO
 */
L.CanvasLayer.VectorField = L.CanvasLayer.extend({
    options: {
        click: true, // 'click_vector' event
        color: "gray"
    },

    initialize: function (vectorField, options) {
        this.vf = vectorField;
        L.Util.setOptions(this, options);
    },

    onLayerDidMount: function () {
        if (this.options.click) {
            this._map.on('mouseover', this._activateClick, this);
            this._map.on('click', this._queryValue, this);
        }
    },

    onLayerWillUnmount: function () {
        if (this.options.click) {
            this._map.off('mouseover', this._activateClick, this);
            this._map.off('click', this._queryValue, this);
        }
    },

    setData: function (data) {
        // -- custom data set
        // TODO
        this.needRedraw(); // -- call to drawLayer
    },

    onDrawLayer: function (viewInfo) {



        /*
                                                        layer : this,
                                                canvas: this._canvas,
                                                bounds: bounds,
                                                size: size,
                                                zoom: zoom,
                                                center : center,
                                                corner : corner
        */

        let row = this.vf.nrows,
            col = this.vf.ncols,
            size = viewInfo.size;

        //var bottomRightCorner = viewInfo.corner;
        let [xmin, ymin, xmax, ymax] = this.vf.extent();

        let topLeft = map.latLngToContainerPoint(new L.LatLng(ymax, xmin)),
            botRight = map.latLngToContainerPoint(new L.LatLng(ymin, xmax));

        var startX = topLeft.x,
            startY = topLeft.y,
            deltaX = (botRight.x - topLeft.x) / col,
            deltaY = (botRight.y - topLeft.y) / row;

        // canvas preparation
        let g = viewInfo.canvas.getContext('2d');
        g.clearRect(0, 0, viewInfo.canvas.width, viewInfo.canvas.height);

        if (startX > size.x || startY > size.y || botRight.x < 0 || botRight.y < 0) {
            return;
        }
        var sI = 0,
            sJ = 0,
            eI = row,
            eJ = col;
        if (startX < -deltaX) {
            sJ = -Math.ceil(startX / deltaX);
            startX += sJ * deltaX;
        }
        if (startY < -deltaY) {
            sI = -Math.ceil(startY / deltaY);
        }
        if (botRight.x > size.x) {
            eJ -= Math.floor((botRight.x - size.x) / deltaX);
        }
        if (botRight.y > size.y) {
            eI -= Math.floor((botRight.y - size.y) / deltaY);
        }
        //var noDataValue = opt.noDataValue; //TODO
        var noDataValue = -9999;

        g.globalAlpha = 0.6;
        console.time('process');
        for (var i = sI; i < eI; i++) {
            var x = startX - deltaX;
            var y = startY + i * deltaY;
            for (var j = sJ; j < eJ; j++) {
                x += deltaX;
                //var cell = data[i][j]; // TODO
                var cell = 0;
                if (cell === noDataValue)
                    continue;

                /* TODO colormap
                var closest = legend.reduce(function (prev, curr) {
                    return (Math.abs(curr.val - cell) < Math.abs(prev.val - cell) ? curr : prev);
                });
                g.fillStyle = closest.color;
                */
                g.fillStyle = 'white';

                g.fillRect(x, y, deltaX, deltaY);
            }
        }
        console.timeEnd('process');
    },


    getBounds: function () {
        let bb = this.vf.extent();
        let southWest = L.latLng(bb[1], bb[0]),
            northEast = L.latLng(bb[3], bb[2]);
        let bounds = L.latLngBounds(southWest, northEast);
        return bounds;
    },

    _activateClick: function () {
        this._map.getContainer().style.cursor = 'default';
    },

    _queryValue: function (e) {
        let lon = e.latlng.lng;
        let lat = e.latlng.lat;
        let result = {
            "latlng": e.latlng,
            "vector": this.vf.valueAt(lon, lat)
        };

        this.fireEvent('click_vector', result); /*includes: L.Mixin.Events,*/
    }
});

L.canvasLayer.vectorField = function (vectorField, options) {
    return new L.CanvasLayer.VectorField(vectorField, options);
}
