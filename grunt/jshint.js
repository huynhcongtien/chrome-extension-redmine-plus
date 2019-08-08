'use strict';

/**
 * Validate js files
 */
module.exports = function () {

    return {
        options: {
            jshintrc: '.jshintrc'
        },
        assets : {
            src: [
                '<%= theme.src %>/js/content-script.js',
                '<%= theme.src %>/js/background.js',
                '<%= theme.src %>/js/popup.js',
                '<%= theme.src %>/js/setting.js'
            ]
        }
    };

};
