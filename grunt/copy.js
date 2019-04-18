'use strict';

/**
 * Copy files and folders
 */
module.exports = function () {

    return {
        pro: {
            files: [
                {
                    expand : true,
                    flatten: true,
                    cwd    : 'node_modules',
                    dest   : '<%= theme.build %>/css/',
                    src    : [
                        'bootstrap/dist/css/bootstrap.css',
                        'font-awesome/css/font-awesome.min.css'
                    ]
                },
                {
                    expand : true,
                    flatten: true,
                    cwd    : 'node_modules',
                    dest   : '<%= theme.build %>/js/',
                    src    : [
                        'bootstrap/dist/js/bootstrap.min.js',
                        'jquery/dist/jquery.js',
                        'moment/min/moment.min.js',
                        'vue/dist/vue.min.js',
                        'notifyjs-browser/dist/notify.js'
                    ]
                },
                {
                    expand : true,
                    flatten: true,
                    cwd    : 'app',
                    dest   : '<%= theme.dist %>/img/',
                    src    : [
                        'assets/src/img/*'
                    ]
                },
                {
                    expand : true,
                    flatten: true,
                    cwd    : 'node_modules',
                    dest   : '<%= theme.dist %>/fonts/',
                    src    : [
                        'font-awesome/fonts/*'
                    ]
                },
            ]
        }
    };

};
