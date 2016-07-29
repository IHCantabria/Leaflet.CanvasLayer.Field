class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Longitud
   * @returns {float} [[Description]]
   */
  longitud() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Ángulo
   * @returns {float} Ángulo, en radianes
   */
  angulo(){
      return Math.atan2(this.y, this.x);
  }

  anguloGrados(){
      return this.angulo() * 180.0/Math.PI;
  }
}
