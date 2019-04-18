'use strict';

/**
 * Watch for changes in live edit
 */
module.exports = function () {

    return {
        options      : {
            livereload: 35729
        },
        css_main     : {
            files: [
                '<%= theme.build %>/css/main.css'
            ],
            tasks: [
                'cssmin:main'
            ]
        },
        css_popup    : {
            files: [
                '<%= theme.build %>/css/popup.css'
            ],
            tasks: [
                'cssmin:popup'
            ]
        },
        css_setting  : {
            files: [
                '<%= theme.build %>/css/setting.css'
            ],
            tasks: [
                'cssmin:setting'
            ]
        },
        sass_main    : {
            files  : [
                '<%= theme.src %>/sass/main.scss'
            ],
            options: {
                livereload: false
            },
            tasks  : [
                'sass:main',
                'cssmin:main',
                'notify:watch_sass'
            ]
        },
        sass_popup   : {
            files  : [
                '<%= theme.src %>/sass/popup.scss'
            ],
            options: {
                livereload: false
            },
            tasks  : [
                'sass:popup',
                'cssmin:popup',
                'notify:watch_sass'
            ]
        },
        sass_setting : {
            files  : [
                '<%= theme.src %>/sass/setting.scss'
            ],
            options: {
                livereload: false
            },
            tasks  : [
                'sass:setting',
                'cssmin:setting',
                'notify:watch_sass'
            ]
        },
        js_main      : {
            files: [
                '<%= theme.src %>/js/content-script.js'
            ],
            tasks: [
                'uglify:main',
                'notify:watch_js'
            ]
        },
        js_popup     : {
            files: [
                '<%= theme.src %>/js/popup.js'
            ],
            tasks: [
                'uglify:popup',
                'notify:watch_js'
            ]
        },
        js_setting   : {
            files: [
                '<%= theme.src %>/js/setting.js'
            ],
            tasks: [
                'uglify:setting',
                'notify:watch_js'
            ]
        },
        js_background: {
            files: [
                '<%= theme.src %>/js/background.js'
            ],
            tasks: [
                'uglify:background',
                'notify:watch_js'
            ]
        },
        grunt        : {
            files  : ['Gruntfile.js'],
            options: {
                reload: true
            }
        }
    };

};
