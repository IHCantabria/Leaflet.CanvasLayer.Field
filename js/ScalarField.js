/**
 * Scalar Field
 */
class ScalarField extends Field {

    constructor(params) {
        super(params);
        this.grid = this._buildGrid(params["z"]);
    }

    /**
     * [[Description]]
     * @param {[[Type]]} asc [[Description]]
     */
    static fromASCIIGrid(asc) {
        //throw Error('Not implemented');

        // Header
        /*
        ncols        10
        nrows        10
        xllcorner    -3.769470033164
        yllcorner    43.460341898838
        cellsize     0.000505065545
        NODATA_value  9.969209968386869e+036
        */

        let lines = asc.split('\n');

        // Header
        let n = /-?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/; // any number
        let NODATA_value = lines[5].replace('NODATA_value', '').trim();

        let p = {
            ncols: parseInt(lines[0].match(n)),
            nrows: parseInt(lines[1].match(n)),
            xllcorner: parseFloat(lines[2].match(n)),
            yllcorner: parseFloat(lines[3].match(n)),
            cellsize: parseFloat(lines[4].match(n))
        };

        // Data (left-right and top-down)
        let zs = []; //
        for (let i = 6; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === '') break;

            let items = line.split(' ');
            let values = items.map(s => {
                return (s !== NODATA_value) ? parseFloat(s) : null;
            });

            zs.push(...values); // es6
        }
        p.zs = zs;

        throw Error('Still implementing...');

        //return new ScalarField(p);
    }
}
