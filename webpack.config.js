module.exports = {
    entry: './src/_main.js',
    output: {
        path: './dist',
        filename: 'leaflet.canvaslayer.field.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
         }]
    }
};
