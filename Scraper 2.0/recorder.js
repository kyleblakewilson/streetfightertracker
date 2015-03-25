var exec = require('child_process').exec;
var videoID = "";

// Set process.argv
process.argv.forEach(function(val, index, array) {
	videoID = val;
});

// Record File
exec('ffmpeg -loglevel panic -f dshow -video_size 1280x720 -i video="XSplitBroadcaster" -qscale 5 video/' + videoID + '.mpeg', function(error, stdout, stderr) {
});