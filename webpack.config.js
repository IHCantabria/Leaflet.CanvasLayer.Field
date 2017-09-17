// webpack.config.js
const webpack = require('webpack');
const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');

const config = {
    context: path.resolve(__dirname, 'src'),
    entry: './_main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'leaflet.canvaslayer.field.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: '/node_modules/',
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: '/node_modules/',
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    'es2015',
                                    {
                                        modules: false
                                    }
                                ]
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: ['echo "Webpack Start"'],
            onBuildEnd: ['node copy-to-examples.js']
        })
    ]
};

module.exports = config;
