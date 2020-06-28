const merge                  = require('webpack-merge');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const common                 = require('./webpack.common.js');

module.exports = merge(common, {
    mode   : 'production',
    plugins: [
        new MergeJsonWebpackPlugin({
            'files' : [
                './app/manifest/manifest_common.json',
                './app/manifest/manifest_prod.json'
            ],
            'output': {
                'fileName': 'manifest.json'
            }
        })
    ]
});
