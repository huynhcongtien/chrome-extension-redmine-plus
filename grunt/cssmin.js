'use strict';

/**
 * Minify css files
 */
module.exports = function () {

    return {
        options: {
            keepSpecialComments: 0
        },
        main   : {
            dest: '<%= theme.dist %>/css/main.min.css',
            src : [
                '<%= theme.build %>/css/main.css'
            ]
        },
        popup  : {
            dest: '<%= theme.dist %>/css/popup.min.css',
            src : [
                '<%= theme.build %>/css/bootstrap.css',
                '<%= theme.build %>/css/font-awesome.min.css',
                '<%= theme.src %>/css/switcher.css',
                '<%= theme.build %>/css/popup.css'
            ]
        },
        setting: {
            dest: '<%= theme.dist %>/css/setting.min.css',
            src : [
                '<%= theme.build %>/css/bootstrap.css',
                '<%= theme.build %>/css/font-awesome.min.css',
                '<%= theme.build %>/css/setting.css'
            ]
        }
    };

};
