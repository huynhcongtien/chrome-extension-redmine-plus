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
                        //'bootstrap/dist/css/bootstrap.min.css',
                        // 'font-awesome/css/font-awesome.min.css'
                        'magnific-popup/dist/magnific-popup.css',
                        'select2/dist/css/select2.min.css'
                    ]
                },
                {
                    expand : true,
                    flatten: true,
                    cwd    : 'node_modules',
                    dest   : '<%= theme.build %>/js/',
                    src    : [
                        'bootstrap/dist/js/bootstrap.min.js',
                        'jquery/dist/jquery.min.js',
                        'vue/dist/vue.min.js',
                        'notifyjs-browser/dist/notify.js',
                        'jquery-ui-dist/jquery-ui.min.js',
                        'magnific-popup/dist/jquery.magnific-popup.min.js',
                        'select2/dist/js/select2.min.js'
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
                }
            ]
        }
    };

};
