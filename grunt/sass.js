'use strict';

/**
 * Compile sass to css
 */
module.exports = function () {

    return {
        main: {
            options: {
                sourcemap: 'none',
                style    : 'compressed'
            },
            files  : {
                '<%= theme.dist %>/css/main.min.css': '<%= theme.src %>/sass/main.scss'
            }
        }
    };

};
