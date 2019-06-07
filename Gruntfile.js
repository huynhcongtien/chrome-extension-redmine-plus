'use strict';

module.exports = function (grunt) {

    // configurable paths for the app
    const appConfig = {
        pkg             : grunt.file.readJSON('package.json'),
        dist            : 'app/assets/dist',
        build           : 'app/assets/build',
        src             : 'app/assets/src',
        compressFileName: 'archive.zip'
    };

    // project configuration
    grunt.initConfig({
        // package.json
        pkg: appConfig.pkg,

        stack: false,

        // project settings
        theme: appConfig
    });

    // load the Grunt plugins
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    // Load grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('grunt')
    });

    // show grunt task time
    require('time-grunt')(grunt);

    grunt.registerTask('lint', [
        'compress',
        'jshint'
    ]);

    grunt.registerTask('pro', [
        'update_manifest:0',
        'prompt',
        'clean',
        'copy',
        'sass',
        'cssmin',
        'uglify:pro',
        'compress',
        'notify:watch_compress'
    ]);

    grunt.registerTask('dev', [
        'update_manifest:1',
        'clean',
        'copy',
        'sass',
        'cssmin',
        'uglify:dev',
        'notify:watch_dev',
        'watch'
    ]);

    grunt.registerTask('default', [
        'dev'
    ]);

    grunt.registerTask('update_manifest', function (is_not_production) {
        var manifestFile   = 'app/manifest.json',
            manifestObject = grunt.file.readJSON(manifestFile);//get file as json object

        manifestObject.background            = {};
        // manifestObject.background.scripts = [
        //     'assets/dist/js/background.min.js'
        // ];
        manifestObject.content_scripts[0].js = [
            'assets/dist/js/main.min.js'
        ];

        if (typeof is_not_production === 'undefined') {
            is_not_production = 1;
        }

        is_not_production = parseInt(is_not_production);

        if (is_not_production) {
            manifestObject.background = {
                scripts: ['assets/src/js/chrome-reload.js']
            };
            // manifestObject.background.scripts.push('assets/src/js/chrome-reload.js');
            manifestObject.content_scripts[0].js.push('assets/src/js/content-script.js');
        }

        grunt.file.write(manifestFile, JSON.stringify(manifestObject, null, 4));//serialize it back to file
    });

};
