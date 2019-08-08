'use strict';

/**
 * Watch for changes in live edit
 */
module.exports = function () {

    return {
        options  : {
            livereload: 35728
        },
        sass_main: {
            files: [
                '<%= theme.src %>/sass/main.scss'
            ],
            tasks: [
                'sass:main',
                'notify:watch_sass'
            ]
        },
        js_main  : {
            files: [
                '<%= theme.src %>/js/content-script.js'
            ]
        },
        grunt    : {
            files  : ['Gruntfile.js'],
            options: {
                reload: true
            }
        }
    };

};
