'use strict';

/**
 * Minify js files
 */
module.exports = function () {

    return {
        options    : {
            compress: {
                warnings: false
            },
            report  : 'min',
            mangle  : true
        },
        main       : {
            files: {
                '<%= theme.dist %>/js/main.min.js': [
                    '<%= theme.build %>/js/jquery.js',
                    '<%= theme.build %>/js/moment.min.js',
                    '<%= theme.src %>/js/content-script.js'
                ]
            }
        },
        popup      : {
            files: {
                '<%= theme.dist %>/js/popup.min.js': [
                    '<%= theme.build %>/js/jquery.js',
                    '<%= theme.src %>/js/popup.js'
                ]
            }
        },
        coreSetting: {
            files: {
                '<%= theme.dist %>/js/core.setting.min.js': [
                    '<%= theme.build %>/js/jquery.js',
                    '<%= theme.build %>/js/bootstrap.min.js',
                    '<%= theme.build %>/js/moment.min.js',
                    '<%= theme.build %>/js/notify.js',
                    '<%= theme.build %>/js/vue.min.js'
                ]
            }
        },
        corePopup  : {
            files: {
                '<%= theme.dist %>/js/core.popup.min.js': [
                    '<%= theme.build %>/js/jquery.js',
                    '<%= theme.build %>/js/bootstrap.min.js',
                    '<%= theme.build %>/js/moment.min.js',
                    '<%= theme.build %>/js/notify.js',
                    '<%= theme.build %>/js/vue.min.js'
                ]
            }
        },
        setting    : {
            files: {
                '<%= theme.dist %>/js/setting.min.js': [
                    '<%= theme.src %>/js/setting.js'
                ]
            }
        },
        background : {
            files: {
                '<%= theme.dist %>/js/background.min.js': [
                    '<%= theme.build %>/js/jquery.js',
                    '<%= theme.build %>/js/moment.min.js',
                    '<%= theme.src %>/js/background.js'
                ]
            }
        }
    };

};
