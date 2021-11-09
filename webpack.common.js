const webpack                    = require('webpack');
const path                       = require('path');
const MiniCssExtractPlugin       = require('mini-css-extract-plugin');
const {CleanWebpackPlugin}       = require('clean-webpack-plugin');
const CopyPlugin                 = require('copy-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const OptimizeCSSAssetsPlugin    = require('optimize-css-assets-webpack-plugin');
const TerserPlugin               = require('terser-webpack-plugin');

module.exports = {
    entry: {
        background: './app/assets/js/background.js',
        content   : [
            './app/assets/sass/content.scss',
            './app/assets/js/content.js'
        ]
    },

    output: {
        path      : path.resolve(__dirname, 'dist'),
        publicPath: '/assets/',
        filename  : 'assets/js/[name].js'
    },

    module      : {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use : [
                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader'
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin()
        ]
    },
    plugins     : [
        new WebpackBuildNotifierPlugin(),
        new CleanWebpackPlugin({
            verbose                : true,  // Write Logs to Console
            cleanStaleWebpackAssets: false  // Automatically remove all unused webpack assets on rebuild
        }),
        new webpack.ProvidePlugin({
            $              : 'jquery',
            jQuery         : 'jquery',
            'window.jQuery': 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename     : 'assets/css/[name].css',
            chunkFilename: 'assets/css/[id].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'app/pages',
                    to  : 'pages'
                },
                {
                    from: 'app/assets/img',
                    to  : 'assets/img'
                },
                {
                    from: 'app/_locales',
                    to  : '_locales'
                },
                {
                    from: 'app/assets/fonts',
                    to  : 'assets/fonts'
                },
                {
                    from: 'app/manifest',
                    to: ''
                }
            ]
        })
    ],
    resolve     : {
        extensions: ['.js', '.jsx', '.scss'],
        alias     : {
            'jquery-ui': 'jquery-ui-dist/jquery-ui.js'
        }
    }
};
