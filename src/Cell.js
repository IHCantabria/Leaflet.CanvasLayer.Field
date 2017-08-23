/**
 *  Simple regular cell in a raster
 */
export default class Cell {
    /**
     * A simple cell with a numerical value
     * @param {L.LatLng} center
     * @param {Number|Vector} value
     * @param {Number} xSize
     * @param {Number} ySize
     */
    constructor(center, value, xSize, ySize = xSize) {
        this.center = center;
        this.value = value;
        this.xSize = xSize;
        this.ySize = ySize;
    }

    equals(anotherCell) {
        return (
            this.center.equals(anotherCell.center) &&
            this._equalValues(this.value, anotherCell.value) &&
            this.xSize === anotherCell.xSize &&
            this.ySize === anotherCell.ySize
        );
    }

    _equalValues(value, anotherValue) {
        let type = value.constructor.name;
        let answerFor = {
            Number: value === anotherValue,
            Vector: value.u === anotherValue.u && value.v === anotherValue.v
        };
        return answerFor[type];
    }

    /**
     * Bounds for the cell
     * @returns {LatLngBounds}
     */
    getBounds() {
        let halfX = this.xSize / 2.0;
        let halfY = this.ySize / 2.0;
        let cLat = this.center.lat;
        let cLng = this.center.lng;
        let ul = L.latLng([cLat + halfY, cLng - halfX]);
        let lr = L.latLng([cLat - halfY, cLng + halfX]);

        return L.latLngBounds(
            L.latLng(lr.lat, ul.lng),
            L.latLng(ul.lat, lr.lng)
        );
    }
}
