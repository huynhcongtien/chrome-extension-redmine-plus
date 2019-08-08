'use strict';

/**
 * Minify css files
 */
module.exports = function () {

    return {
        options  : {
            keepSpecialComments: 0
        },
        main_core: {
            dest: '<%= theme.dist %>/css/main.core.min.css',
            src : [
                '<%= theme.build %>/css/font-awesome.min.css'
            ]
        }
    };

};
