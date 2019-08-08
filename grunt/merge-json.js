'use strict';

/**
 * Merge json file
 */
module.exports = function () {

    return {
        options: {
            space: '    '
        },
        dev    : {
            src : [
                '<%= theme.manifestDir %>/manifest_base.json',
                '<%= theme.manifestDir %>/manifest_dev.json'
            ],
            dest: 'app/manifest.json'
        },
        pro    : {
            src : [
                '<%= theme.manifestDir %>/manifest_base.json',
                '<%= theme.manifestDir %>/manifest_pro.json'
            ],
            dest: 'app/manifest.json'
        }
    };

};
