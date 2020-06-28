const merge                  = require('webpack-merge');
const LiveReloadPlugin       = require('webpack-livereload-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const common                 = require('./webpack.common.js');

module.exports = merge(common, {
    mode        : 'development',
    devtool     : 'inline-source-map',
    watch       : true, // Set to false to keep the grunt process alive
    watchOptions: {
        aggregateTimeout: 500
        // poll: true // Use this when you need to fallback to poll based watching (webpack 1.9.1+ only)
    },
    plugins     : [
        new LiveReloadPlugin({
            port: 35729
        }),
        new MergeJsonWebpackPlugin({
            'files' : [
                './app/manifest/manifest_common.json',
                './app/manifest/manifest_dev.json'
            ],
            'output': {
                'fileName': 'manifest.json'
            }
        })
    ]
});
