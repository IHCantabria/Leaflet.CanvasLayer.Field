// webpack.config.js
const webpack = require('webpack')
const path = require('path')

const config = {
    context: path.resolve(__dirname, 'src'),
    entry: './_main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'leaflet.canvaslayer.field.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', {
                            modules: false
                        }]
                    ]
                }
            }]
        }]
    }
}

module.exports = config
