module.exports = function(grunt){
	grunt.initConfig({
		concat : {
			dist : {
				src : [
					'js/jquery-ui-1.8.18.custom.min.js',
					'js/jquery.easing.1.3.js',
					'js/jquery.ui.plugin.js',
					'js/app.js'
				],
				dest : 'js/all.js'
			}
		},
		min : {
			dist : {
				src : ['js/all.js'],
				dest : 'js/all.min.js'
			}
		},
		sass : {
			dist : {
				src : ['scss/all.scss'],
				dest : 'css/all.css'
			}
		},
		cssmin : {
			dist : {
				src : ['css/all.css'],
				dest : 'css/all.min.css'
			}
		}
	});
	grunt.loadTasks('gruntTasks');
};
