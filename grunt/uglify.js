'use strict';

/**
 * Minify js files
 */
module.exports = function () {

    return {
        options : {
            compress: {
                warnings: false
            },
            report  : 'min',
            mangle  : true
        },
        dev: {
            files: {
                '<%= theme.dist %>/js/main.min.js': [
                    '<%= theme.build %>/js/jquery.min.js'
                ],
                '<%= theme.dist %>/js/background.min.js': [
                    '<%= theme.src %>/js/background.js'
                ],
            }
        },
        pro: {
            files: {
                '<%= theme.dist %>/js/main.min.js': [
                    '<%= theme.build %>/js/jquery.min.js',
                    '<%= theme.src %>/js/content-script.js'
                ]
            }
        }
    };

};
