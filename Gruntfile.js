'use strict';

module.exports = function (grunt) {

    // project configuration
    grunt.initConfig({
        // package.json
        pkg: grunt.file.readJSON('package.json')
    });

    // load the Grunt plugins
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    // Load grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('grunt')
    });

    grunt.registerTask('default', [
        'prompt',
        'shell:buildSource',
        'compress'
    ]);

};
