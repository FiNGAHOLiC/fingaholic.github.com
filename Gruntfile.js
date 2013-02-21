module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: 'js/*.js',
				tasks: ['concat', 'uglify']
			},
			sass: {
				files: 'scss/*.scss',
				tasks: ['sass', 'cssmin']
			}
		},
		concat: {
			common: {
				files: {
					'js/all.js': [
						'js/jquery-ui-1.8.18.custom.min.js',
						'js/jquery.easing.1.3.js',
						'js/jquery.ui.plugin.js',
						'js/app.js'
					]
				}
			}
		},
		uglify: {
			common: {
				files: {
					'js/all.min.js': 'js/all.js'
				}
			}
		},
		sass: {
			common: {
				options: {
					style: 'compressed'
				},
				files: {
					'css/all.css': 'scss/all.scss'
				}
			}
		},
		cssmin: {
			compress: {
				files: {
					'css/all.min.css': 'css/all.css'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib');

	grunt.registerTask('default', ['concat', 'uglify', 'sass', 'cssmin', 'watch']);

};
