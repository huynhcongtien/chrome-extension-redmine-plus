'use strict';

/**
 * Compress files and folders
 */
module.exports = function () {

    return {
        main: {
            options: {
                archive: '<%= pkg.name %>.zip'
            },
            files  : [{
                expand: true,
                cwd   : 'dist/',
                src   : [
                    '_locales/**',
                    'assets/**',
                    'pages/**',
                    'manifest.json'
                ],
                dest  : '/'
            }]
        }
    };

};
