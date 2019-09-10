'use strict';

/**
 * Minify js files
 */
module.exports = function () {

    return {
        options : {
            compress: {
                drop_console: true
            },
            report  : 'min',
            mangle  : true
        },
        main_dev: {
            files: {
                '<%= theme.dist %>/js/main.core.min.js': [
                    '<%= theme.build %>/js/jquery.min.js',
                    '<%= theme.build %>/js/jquery-ui.min.js',
                    '<%= theme.build %>/js/jquery.magnific-popup.min.js',
                    '<%= theme.build %>/js/select2.min.js',
                    '<%= theme.src %>/js/font-awesome.js'
                ]
            }
        },
        main_pro: {
            files: {
                '<%= theme.dist %>/js/main.min.js': [
                    '<%= theme.build %>/js/jquery.min.js',
                    '<%= theme.build %>/js/jquery-ui.min.js',
                    '<%= theme.build %>/js/jquery.magnific-popup.min.js',
                    '<%= theme.build %>/js/select2.min.js',
                    '<%= theme.src %>/js/font-awesome.js',
                    '<%= theme.src %>/js/content-script.js'
                ]
            }
        },
        background_dev: {
            files: {
                '<%= theme.dist %>/js/background.core.min.js': [
                    '<%= theme.build %>/js/jquery.min.js'
                ]
            }
        },
        background_pro: {
            files: {
                '<%= theme.dist %>/js/background.min.js': [
                    '<%= theme.build %>/js/jquery.min.js',
                    '<%= theme.src %>/js/background.js'
                ]
            }
        }
    };

};
