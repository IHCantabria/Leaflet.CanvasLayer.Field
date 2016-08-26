/**
 * Colormap based on chromajs (http://gka.github.io/chroma.js/)
 */
class ColorMap {
    /**
     * New colormap
     * @param   {Function} scale   - chroma.scale function
     * @param   {Array} domain - [min, max]
     * @param   {String} units - short description, e.g. 'm/s'
     * @returns {ColorMap}
     */
    constructor(scale, domain, units) {
        this.scale = scale;
        this.domain = domain;
        this.units = units;
    }

    /**
     * Default colormap for Ocean Currents Velocity (m/s)
     * @param   {Array} domain - 0-2 m/s
     * @returns {ColorMap}
     */
    static forCurrents(domain = [0, 2]) {
        //let scale = chroma.scale(['#00008F', '#8C0000']).domain(domain); // similar to sst_36
        let s = chroma.scale('OrRd').domain(domain);
        //let scale = chroma.scale(['cyan', 'red']).domain(domain);
        let m = new ColorMap(s, domain, 'm/s');
        return m;
    }

    /*
        ColorBrewer palettes
        - Sequential:
        Blues BuGn BuPu GnBu Greens Greys Oranges OrRd PuBu PuBuGn PuRd Purples RdPu Reds YlGn YlGnBu YlOrBr YlOrRd

        - Diverging:
        BrBG PiYG PRGn PuOr RdBu RdGy RdYlBu RdYlGn Spectral
    */
}
