module.exports = {
    entry: './src/_main.js',
    output: {
        path: './dist',
        filename: 'leaflet.canvaslayer.field.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            }
        ],
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
         }]
    },
    rules: {
        "no-unused-vars": "warn"
    }
};
