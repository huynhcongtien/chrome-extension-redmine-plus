'use strict';

/**
 * Watch for changes in live edit
 */
module.exports = function () {

    return {
        options  : {
            livereload: 35728
        },
        // css_main : {
        //     files: [
        //         '<%= theme.build %>/css/main.css'
        //     ],
        //     tasks: [
        //         'cssmin:main'
        //     ]
        // },
        sass_main: {
            files  : [
                '<%= theme.src %>/sass/main.scss'
            ],
            // options: {
            //     livereload: true
            // },
            tasks  : [
                'sass:main',
                'cssmin:main',
                'notify:watch_sass'
            ]
        },
        js_main  : {
            files: [
                '<%= theme.src %>/js/content-script.js'
            ],
            tasks: [
                'notify:watch_js'
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
