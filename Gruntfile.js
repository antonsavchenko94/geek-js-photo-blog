module.exports = function(grunt) {
    grunt.initConfig({
        bowercopy: {
            options: {
                srcPrefix: 'bower_components'
            },
            libs: {
                options: {
                    destPrefix: 'dist/lib'
                },
                files: {
                    // put file into parent folder if it has to be loaded before files in subfolders

                    // Angular
                    'angular.min.js': 'angular/angular.min.js',
                    'angular/angular-route.min.js': 'angular-route/angular-route.min.js',
                    'angular/angular-resource.min.js': 'angular-resource/angular-resource.min.js',
                    'angular/ng-file-upload-all.min.js': 'ng-file-upload/ng-file-upload-all.min.js',

                    // Bootstrap
                    'bootstrap/bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
                    'bootstrap/bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
                    'fonts/glyphicons-halflings-regular.woff': 'bootstrap/fonts/glyphicons-halflings-regular.woff',
                    'fonts/glyphicons-halflings-regular.woff2': 'bootstrap/fonts/glyphicons-halflings-regular.woff2',

                    // Jquery
                    'jquery.min.js': 'jquery/dist/jquery.min.js'
                }
            }
        },

        copy: {
            template: {
                cwd: 'public/template/',
                src: '**',
                dest: 'dist/template/',
                expand: true
            },
            css: {
                src: 'public/stylesheets/style.css',
                dest: 'dist/css/',
                flatten: true,
                expand: true
            },
            images: {
                cwd: 'public/images/',
                src: '**',
                dest: 'dist/images/',
                expand: true
            }
        },

        concat: {
            app: {
                src: ['public/js/app/app.module.js', 'public/js/**/*.js'],
                dest: 'dist/js/app.min.js'
            }
        },

        uglify: {
            app: {
                files: {
                    'dist/js/app.min.js': ['dist/js/app.min.js']
                }
            },
            dev: {
                options: {
                    beautify: true
                },
                files: {
                    'dist/js/app.min.js': ['dist/js/app.min.js']
                }
            }
        },

        includeSource: {
            layout: {
                templates: {
                    jade: {
                        js: 'script(src="{filePath}")',
                        css: 'link(href="{filePath}", rel="stylesheet")'
                    }
                },
                files: {
                    'views/layout.jade': 'views/layout.jade'
                }
            }
        },

        clean: {
            dist: ['dist']
        },

        ngAnnotate: {
            app:{
                files: {
                    'dist/js/app.min.js': ['dist/js/app.min.js']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');

    // load dependencies from package.json and bower.json, copy bower packages to lib folder
    grunt.registerTask('load-dep', ['npm-install', 'bower:install', 'bowercopy']);

    // move files to dist, minify and include them to layout
    grunt.registerTask('build', [
        'concat',
        'ngAnnotate',
        'uglify',
        'copy',
        'includeSource'
    ]);

    grunt.registerTask('default', ['load-dep', 'build']);
};