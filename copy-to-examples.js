var fs = require('fs-extra');

var source = './dist/leaflet.canvaslayer.field.js';
var dest = './docs/dist/leaflet.canvaslayer.field.js';
fs.copy(source, dest, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Copied to ' + dest);
});
