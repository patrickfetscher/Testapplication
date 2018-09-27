// Copyright 2016 SAP SE.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.
'use strict';
module.exports = function(grunt) {
	var BuildID = grunt.option('BuildID'); //get value of target, my_module
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					hostname: '0.0.0.0',
					port: 8080,
					base: './',
					livereload: 35729,
					keepalive: true
				}
			}
		},
		clean: {
			build: ['./build/']
		},

		replace: {
			dist: {
				options: {
					patterns: [{
						match: 'builddate',
						replacement: BuildID
					}]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['./webapp/view/Main.view.xml'],
					dest: './build/webapp/view/'
				}, {
					expand: true,
					flatten: true,
					src: ['./webapp/model/app.json'],
					dest: './build/webapp/model/'
				}, {
					expand: true,
					flatten: true,
					src: ['./build/webapp/manifest.json'],
					dest: './build/webapp/'
				}, {
					expand: true,
					flatten: true,
					src: ['./build/webapp/Component-preload.js'],
					dest: './build/webapp/'
				}]
			}
		},

		uglify: {
			options: {
				mangle: true,
				compress: {
					drop_console: true,
					dead_code: false,
					unused: false
				}
			},
			files: {
				expand: true,
				src: './webapp/**/*.js',
				dest: './build/'
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					src: ['./**', '!./node_modules/**', '!./build/**', '!./zip/*'],
					dest: './build/',
					rename: function(dest, src) {
						var destinationFilename = "";
						if (src.search('controller') > 0) {
							destinationFilename = dest + src.replace(/\.controller\.js$/, "-dbg.controller.js");
						} else {
							destinationFilename = dest + src.replace(/\.js$/, "-dbg.js");
						}
						//grunt.log.writeln(destinationFilename + " | " + src);  
						return destinationFilename;
					}
				}, {
					expand: true,
					src: ['.Ui5RepositoryUploadParameters'],
					dest: './build/'
				}]
			},
			other: {
				// ...  
			}
		},
		openui5_preload: {
			component: {
				options: {
					resources: {
						cwd: './webapp/',
						prefix: '<%= pkg.namespace %>/'
					},
					dest: './build/webapp/'
				},
				components: true
			}
		},
		zip: {
			all: {
				cwd: './build/webapp/',
				src: ['./build/.Ui5RepositoryUploadParameters', './build/webapp/**'],
				dest: './zip/<%= pkg.name %>_<%= pkg.version %>.zip'
			}
		}

	});
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('default', ['clean', 'openui5_preload', 'copy', 'uglify', 'replace']);
};