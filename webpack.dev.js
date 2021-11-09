const {merge}                 = require('webpack-merge');
const common                  = require('./webpack.common.js');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = merge(common, {
    mode        : 'development',
    devtool     : 'eval-source-map',
    watch       : true, // Set to false to keep the grunt process alive
    watchOptions: {
        aggregateTimeout: 500
        // poll: true // Use this when you need to fallback to poll based watching (webpack 1.9.1+ only)
    },
    plugins     : [
        new ChromeExtensionReloader({
            port   : 35729,
            entries: {
                contentScript: 'content',
                background   : 'background'
            }
        })
    ]
});
