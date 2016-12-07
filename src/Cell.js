/**
 *  Simple regular cell in a raster
 */
export default class Cell {

    /**
     * A simple cell with value and size
     * @param {L.LatLng} center
     * @param {Number} value
     * @param {Number} size
     */
    constructor(center, value, size) {
        this.center = center;
        this.value = value;
        this.size = size;
    }

    /**
     * Bounds for the cell
     * @returns {LatLngBounds}
     */
    getBounds() {
        let half = this.size / 2.0;
        let ul = L.latLng([this.center.lat + half, this.center.lon - half]);
        let lr = L.latLng([this.center.lat - half, this.center.lon + half]);

        return L.latLngBounds(L.latLng(lr.lat, ul.lng), L.latLng(ul.lat, lr.lng));
    }
}
