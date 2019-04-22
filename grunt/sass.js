'use strict';

/**
 * Compile sass to css
 */
module.exports = function () {

    return {
        main: {
            options: {
                sourcemap: 'none',
                style    : 'expanded'
            },
            files  : {
                '<%= theme.build %>/css/main.css': '<%= theme.src %>/sass/main.scss'
            }
        }
    };

};
