var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var async = require('async');

// Config Path
var file = __dirname + '/live_matchinfo.json';

// Variables
var captureTime = -10;
var newMatch = true;

// Get Match ID
var matchID = 153;

// Capture Timer
var captureTimer = function() {
    // Set Interval to 10 Seconds
    captureTime += 10;

    // Covert to MM:SS
    var minutes = parseInt(captureTime/60);
    var seconds = parseInt(captureTime%60);

    // Format 0 for ffmpeg
    if(seconds === 0) {
    	seconds = '00';
    }

    // Retrun Time
    return minutes + ":" + seconds;
}

// Recording Function
function record() {
	// Start Recording
	var record = spawn('node', ['recorder.js', matchID]);

	// Stop Recording
	record.on('exit', function() {
		console.log('|| Recording: Complete');
	});
};

// Capture Function
function capture(callback) {
	// Get Time
	var captureTime = captureTimer();

	// Start Capture
	var capture = spawn('node', ['capture.js', [matchID, captureTime]]);

	// Stop Capture
	capture.on('exit', function() {
		console.log('|| Capture: Complete');
		callback();
	});

	// Output Console Text
	capture.stdout.on('data', function (data) {
    	var processerOuput = data.toString().trim();
	  	console.log('' + processerOuput);
	});
	 
	//Output Console Errors
	capture.stderr.on('data', function (data) {
	  	var processerOuput = data.toString().trim();
	  	console.log('' + processerOuput);
	});
};

// Crop Function
function crop(callback) {
	// Start Crop
	var crop = spawn('node', ['crop.js']);

	// Stop Cropping
	crop.on('exit', function() {
		console.log('|| Crop: Complete');
		callback();
	});

	// Output Console Text
	crop.stdout.on('data', function (data) {
    	var processerOuput = data.toString().trim();
	  	console.log('' + processerOuput);
	});
	 
	//Output Console Errors
	crop.stderr.on('data', function (data) {
	  	var processerOuput = data.toString().trim();
	  	console.log('' + processerOuput);
	});
};

// Validate Function
function validate(callback) {
	// Start Validation
	var validate = spawn('node', ['validate.js']);

	// Stop Validation
	validate.on('exit', function() {
		console.log('|| Validate: Complete');
		callback();
	});

	// Output Console Text
	validate.stdout.on('data', function (data) {
    	var processerOuput = data.toString().trim();
	  	console.log('' + processerOuput);
	});
	 
	//Output Console Errors
	validate.stderr.on('data', function (data) {
	  	var processerOuput = data.toString().trim();
	  	console.log('' + processerOuput);
	});
};


function mainController() {
	// Start Execution Clock
	var start = process.hrtime();

	// Start New Match
	if(newMatch == true){
		console.log('=======================');
		console.log('||     New Match     ||');
		console.log('=======================');

		// Make New JSON File
		fs.writeFileSync('live_matchinfo.json', fs.readFileSync('matchinfo.json'));

		fs.readFile(file, 'utf8', function (err, data) {
		  	if (err) {
		    	console.log('Error: ' + err);
		    	return;
		  	}

		  	appConfig = JSON.parse(data);
		  	appConfig[0].matchinfo.id = matchID;
		  	fs.writeFile('live_matchinfo.json', JSON.stringify(appConfig), function (err) {
		  		
		  	});
		});

		// Start Recording
		record();
	}

	async.series([
	    function(callback) {
	    	capture(function() {
	    		callback(null,'|| CAPTURE: Success!');
	    	});
	    },
	    function(callback) {
	    	crop(function() {
	    		callback(null,'|| CROP: Success!');
	    	});
	    }
	    // function(callback) {
	    // 	callback();
	    // 	validate(function() {
	    // 		callback(null,'|| VALIDATE: Success!');
	    // 	});
	    // }
	],
	function(err, results){
		console.log('=======================');
		console.log(results[0]);
		console.log(results[1]);
		newMatch = false;

		// Stop Execution Clock
		var end = process.hrtime(start);
		var time = parseInt(end.join().replace(',', '.'));
		
		if(time > 10) {
			mainController();
			console.log('|| Execution Time: ' + time + ' Seconds');
			console.log('=======================');
		} else {
			var timeDiff = 10 - time;
			console.log('|| Execution Time: ' + time + ' Seconds');
			console.log('|| Execution Delay: ' + timeDiff + ' Seconds');
			console.log('=======================');
			setTimeout(function() {
				mainController();
			}, timeDiff * 1000);
		}
	});
};

// Start Main Controller
mainController();