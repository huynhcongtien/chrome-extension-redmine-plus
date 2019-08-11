'use strict';

module.exports = function (grunt) {

    // configurable paths for the app
    const appConfig = {
        pkg             : grunt.file.readJSON('package.json'),
        dist            : 'app/assets/dist',
        build           : 'app/assets/build',
        src             : 'app/assets/src',
        manifestDir     : 'app/manifest',
        pages           : 'app/pages',
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

    grunt.registerTask('lint', [
        'compress',
        'jshint'
    ]);

    grunt.registerTask('dev', [
        'clean',
        'copy',
        'sass',
        'cssmin',
        'uglify:main_dev',
        'uglify:background_dev',
        'merge-json:dev',
        'notify:watch_dev',
        'watch'
    ]);

    grunt.registerTask('pro', [
        'prompt',
        'clean',
        'copy',
        'sass',
        'cssmin',
        'uglify:main_pro',
        'uglify:background_pro',
        'merge-json:pro',
        'compress',
        'notify:watch_compress'
    ]);

    grunt.registerTask('default', [
        'dev'
    ]);

};
