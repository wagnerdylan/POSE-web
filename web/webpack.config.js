const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/webview/webview.js',
    mode: 'development',
    output: {
        filename: 'webview.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            three$: 'three/build/three.min.js',
            'three/.*$': 'three',
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            THREE: 'three',
        }),
    ],
};