var exec = require('child_process').exec;
var fs = require('fs');
var matchInfo;

// Arguments passed from app.js
process.argv.forEach(function(val, index, array) {
	matchInfo = val.split(",");
});


// Take 10 seconds of video and convert to 20 images
function captureCommand() {
	exec('ffmpeg -i videos/' + matchInfo[0] + '.flv -y -r 2 -vframes 20 -ss 00:0' + matchInfo[1] + ' images/capture/frames/%d.png', function(error, stdout, stderr) {
		// Returns Nothing, this process is killed by app.js
	});
}


function capture() {
	// Check to make sure file exists
	fs.exists('videos/' + matchInfo[0] + '.flv', function(exists) {
		if(exists) {
			// Check to see if it's a new match and add delay if true
			if(matchInfo[1] == '0:00') {
				console.log('|| Notice: Setting 10 Second Timeout for Match Start');
				setTimeout(function() {
					console.log('|| Capture: Starting');
					captureCommand();
				}, 10000)

			// Or just start the capture
			} else {
				console.log('|| Capture: Starting');
				captureCommand();
			}
		} else {
			capture();
		}
	});
}

// Start Capture
capture();