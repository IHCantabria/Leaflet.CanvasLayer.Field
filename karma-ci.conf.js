// Karma configuration for CI testing

module.exports =
  function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'node_modules/leaflet/dist/leaflet.js',
            'node_modules/d3/build/d3.js',
            'node_modules/geotiff/dist/geotiff.browserify.js',
            'dist/leaflet.canvaslayer.field.js',
            {
                pattern: 'docs/data/*.{asc,tiff,tif}',
                watched: true,
                included: false,
                served: true
            },
            'spec/**/*Spec.js'
        ],
        exclude: [],
        preprocessors: {},
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['ChromeHeadless'],
        singleRun: true,
        concurrency: Infinity
    });
};
