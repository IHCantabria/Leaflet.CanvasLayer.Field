/**
 *  2D Vector
 */
export default class Vector {

    constructor(u, v) {
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
     * Angle in degrees (0 to 360º) --> Towards
     * N is 0º and E is 90º
     * @returns {Number}
     */
    directionTo() {
        let verticalAngle = Math.atan2(this.u, this.v);
        let inDegrees = verticalAngle * (180.0 / Math.PI);
        if (inDegrees < 0) {
            inDegrees = inDegrees + 360.0;
        }
        return inDegrees;
    }

    /**
     * Angle in degrees (0 to 360º) From x-->
     * N is 0º and E is 90º
     * @returns {Number}
     */
    directionFrom() {
        let a = this.directionTo();
        let opposite = (a + 180.0) % 360.0;
        return opposite;
    }

    /*
        Degrees --> text
        new Dictionary<int, string>
        {
            //{0, 23, 45, 68, 90, 113, 135, 158, 180, 203, 225, 248, 270, 293, 315, 338, 360};
            {0, 'N'},
            {23, 'NNE'},
            {45, 'NE'},
            {68, 'ENE'},
            {90, 'E'},
            {113, 'ESE'},
            {135, 'SE'},
            {158, 'SSE'},
            {180, 'S'},
            {203, 'SSW'},
            {225, 'SW'},
            {248, 'WSW'},
            {270, 'W'},
            {293, 'WNW'},
            {315, 'NW'},
            {338, 'NNW'},
            {360, 'N'}
        };
    */
}
