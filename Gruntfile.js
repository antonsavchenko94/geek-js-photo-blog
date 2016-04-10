module.exports = function(grunt) {
    grunt.initConfig({
        bower: {
            install: {
            }
        },

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
                    'angular.min.js.map': 'angular/angular.min.js.map',
                    'angular/angular-route.min.js': 'angular-route/angular-route.min.js',
                    'angular/angular-route.min.js.map': 'angular-route/angular-route.min.js.map',
                    'angular/angular-resource.min.js': 'angular-resource/angular-resource.min.js',
                    'angular/angular-resource.min.js.map': 'angular-resource/angular-resource.min.js.map',
                    'angular/ng-file-upload-all.min.js': 'ng-file-upload/ng-file-upload-all.min.js',
                    'angular/timeAgo.js': 'angular-timeago/src/timeAgo.js',

                    // Bootstrap
                    'bootstrap/bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
                    'bootstrap/bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
                    'fonts/glyphicons-halflings-regular.woff': 'bootstrap/fonts/glyphicons-halflings-regular.woff',
                    'fonts/glyphicons-halflings-regular.woff2': 'bootstrap/fonts/glyphicons-halflings-regular.woff2',
                    'bootstrap/bootstrap.min.css.map': 'bootstrap/dist/css/bootstrap.min.css.map',

                    // Jquery
                    'jquery.min.js': 'jquery/dist/jquery.min.js'
                }
            }
        },

        copy: {
            images: {
                cwd: 'public/images/',
                src: '**',
                dest: 'dist/images/',
                expand: true
            }
        },

        concat: {
            app: {
                src: ['public/js/app/app.module.js', 'public/template/template.min.js', 'public/js/**/*.js'],
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
                    'views/layout.jade': 'views/layout.tpl.jade'
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
        },

        cssmin: {
            app: {
                files: {
                    'dist/css/style.min.css': ['public/stylesheets/**/*.css']
                }
            }
        },

        ngtemplates:  {
            blog: {
                cwd: 'public/',
                src: 'template/*.html',
                dest: 'public/template/template.min.js',
                options: {
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true
                    }
                }
            }
        },

        watch: {
            js: {
                files: ['public/js/*'],
                tasks: ['minify-app']
            },
            css: {
                files: ['public/stylesheets/*'],
                tasks: ['cssmin']
            },
            images: {
                files: ['public/images/*'],
                tasks: ['copy:images']
            },
            template: {
                files: ['public/template/**/*.html'],
                tasks: ['ngtemplates', 'minify-app']
            }
        }
    });

    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-angular-templates');

    // concat and minify public/js/ files
    grunt.registerTask('minify-app', [
        'concat',
        'ngAnnotate',
        'uglify:app'
    ]);

    // move files to dist, minify and include them to layout
    grunt.registerTask('build', [
        'ngtemplates',
        'minify-app',
        'cssmin',
        'copy',
        'includeSource'
    ]);

    grunt.registerTask('default', ['bowercopy', 'build']);
};