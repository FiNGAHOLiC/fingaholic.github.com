module.exports = function(grunt){
	grunt.initConfig({
		concat : {
			'js/all.js' : [
				'js/jquery-ui-1.8.18.custom.min.js',
				'js/jquery.easing.1.3.js',
				'js/jquery.ui.plugin.js',
				'js/app.js'
			]
		},
		min : {
			'js/all.min.js' : 'js/all.js'
		}
	});
};
