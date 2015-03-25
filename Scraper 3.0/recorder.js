var exec = require('child_process').exec;
var matchIndex;

// Set process.argv
process.argv.forEach(function(val, index, array) {
	matchIndex = val;
});

console.log('|| Recording: Starting');

// Record File
exec('ffmpeg -f dshow -video_size 1280x720 -i video="XSplitBroadcaster" -y -qscale 10 videos/' + matchIndex + '.flv', function(error, stdout, stderr) {
	// Nothing
});