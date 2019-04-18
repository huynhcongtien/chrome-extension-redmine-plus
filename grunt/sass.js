'use strict';

/**
 * Compile sass to css
 */
module.exports = function () {

    return {
        main   : {
            options: {
                sourcemap: 'none',
                style    : 'expanded'
            },
            files  : {
                '<%= theme.build %>/css/main.css': '<%= theme.src %>/sass/main.scss'
            }
        },
        popup  : {
            options: {
                sourcemap: 'none',
                style    : 'expanded'
            },
            files  : {
                '<%= theme.build %>/css/popup.css': '<%= theme.src %>/sass/popup.scss'
            }
        },
        setting: {
            options: {
                sourcemap: 'none',
                style    : 'expanded'
            },
            files  : {
                '<%= theme.build %>/css/setting.css': '<%= theme.src %>/sass/setting.scss'
            }
        }
    };

};
