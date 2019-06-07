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
                '<%= theme.build %>/css/font-awesome.min.css',
                '<%= theme.build %>/css/main.css'
            ]
        }
    };

};
