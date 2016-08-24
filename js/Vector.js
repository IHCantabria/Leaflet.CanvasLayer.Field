/**
 *  2D Vector (u | v)
 */
class Vector {
    /**
     * @param {Number} u
     * @param {Number} v
     */
    constructor(u, v) {
        this.u = u;
        this.u = u;
        this.v = v;
    }

    /**
     * Magnitude
     * @returns {Number}
     */
    magnitude() {
        return Math.sqrt(this.u * this.u + this.v * this.v);
    }

    /**
     * Direction (radians)
     * @returns {Number}
     */
    direction() {
        return Math.atan2(this.v, this.u);
    }

    /**
     * Direction (degrees)
     * @returns {Number}
     */
    directionDeg() {
        return this.direction() * 180.0 / Math.PI;
    }
}
