module.exports = function(grunt){
	var log = grunt.log;
	var proc = require('child_process');
	grunt.registerMultiTask('sass', 'sass compile', function() {
		var done = this.async();
		var src = this.file.src;
		var dest = this.file.dest;
		var command = 'sass ' + src + ':' + dest;
		var out = proc.exec(command, function(error, stdout, stderr){
			if(error || stderr){
				log.writeln('File "' + dest + '" failed.');
				done(false);
			}else{
				log.writeln('File "' + dest + '" created.');
				done(true);
			}
		});
	});

};
