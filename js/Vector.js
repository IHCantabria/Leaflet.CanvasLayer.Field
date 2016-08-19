class Vector {
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }

    /**
     * Longitud (módulo)
     * @returns {float} [[Description]]
     */
    longitud() {
        return Math.sqrt(this.u * this.u + this.v * this.v);
    }

    /**
     * Ángulo (dirección)
     * @returns {float} Ángulo, en radianes
     */
    angulo() {
        return Math.atan2(this.v, this.u);
    }

    anguloGrados() {
        return this.angulo() * 180.0 / Math.PI;
    }
}
