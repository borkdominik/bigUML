// @ts-check
const path = require('path');

const outputPath = path.resolve(__dirname, '../extension/pack');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'web',

    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        filename: 'webview.js',
        path: outputPath
    },
    devtool: 'eval-source-map',
    mode: 'development',

    resolve: {
        fallback: {
            fs: false,
            net: false,
        },
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader']
            },
            {
                test: /\.gif?$/,
                use: ['file-loader']
            },
            {
                test: /\.svg?$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            {
                test: /\.css$/,
                exclude: /(codicon|\.useable)\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /codicon.css$/,
                use: ['ignore-loader']
            }
        ]
    },
    ignoreWarnings: [/Failed to parse source map/, /Can't resolve .* in '.*ws\/lib'/],
};

module.exports = config;
