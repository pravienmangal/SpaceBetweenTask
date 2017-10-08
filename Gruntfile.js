module.exports = function (grunt) {
    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            compiled: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'styles/sass/compiled/client.css': 'styles/sass/master.sass',
                    'styles/sass/compiled/flat.css': 'styles/sass/flatten.sass'
                }
            }
        },

        concat: {
            styles: {
                src: [
                    'styles/libs/normalize.css',
                    'styles/sass/compiled/client.css'
                ],
                dest: 'styles/styles.css'
            },
            flat: {
                src: [
                    'styles/libs/normalize.css',
                    'styles/sass/compiled/flat.css'
                ],
                dest: 'styles/ie.css'
            },
            scripts: {
                src: [
                    'scripts/libs/jquery.js',
					'scripts/libs/easing.js',
					'scripts/libs/cookie.js',					
					'scripts/libs/jquery.validate.min.js',					
					'scripts/libs/jquery.validate.unobtrusive.min.js',					
					'<%= jshint.files %>'
                ],
                dest: 'scripts/scripts.js',
            }
        },

        cssmin: {
            minify: {
                expand: false,
                src: 'styles/styles.css',
                dest: 'styles/styles.min.css'
            },
            minifyflat: {
				options: {
					compatibility: 'ie8'
				},
                expand: false,
                src: 'styles/ie.css',
                dest: 'styles/ie.min.css'
            }
        },

        jshint: {
            files: [
				'scripts/modules/_.console.js',
                'scripts/modules/_.js',
				'scripts/modules/_.carousel.js',
				'scripts/modules/_.addthis.js',
                'scripts/modules/_.responsive.js',
				'scripts/modules/_.forms.js',
				'scripts/modules/_.filter.js',
				'scripts/modules/_.pagination.js',
				'scripts/modules/_.lazyLoad.js',
				'scripts/modules/_.cookie.js',
				'scripts/modules/_.gmap.js',
				'scripts/modules/_.lightbox.js',
				'scripts/modules/_.slidein.js',
				'scripts/modules/_.navigation.js'
			],
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'scripts/scripts.min.js': [
						'scripts/scripts.js'
                    ]
                }
            }
        },

        watch: {
            styles: {
                files: 'styles/sass/*.sass',
                tasks: ['sass', 'concat:styles', 'concat:flat']
            },
            js: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint', 'concat:scripts']
            }
        }
    });

    grunt.registerTask('dev', ['jshint', 'sass', 'concat']);
    grunt.registerTask('default', ['jshint', 'sass', 'concat', 'cssmin', 'uglify']);
    //grunt.registerTask('all', ['sass:dev', 'sass:prod', 'concat:styles', 'concat:flat', 'cssmin', 'jshint', 'concat:scripts', 'uglify']);
};