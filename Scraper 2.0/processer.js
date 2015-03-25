var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var async = require('async');
var start = process.hrtime();

var P1Char = fs.readdirSync('assets/P1Char');
var P2Char = fs.readdirSync('assets/P2Char');

// Match Data
var matchData = [{
	matchID: "",
	playerOneChar: ''
}]

// Timer Index for Recording Processing
var timeIndex = -10;

// Set Match ID
matchData.matchID = Math.floor((Math.random() * 1000) + 1);

// Start Recording Process
var recoder = spawn('node', ['recorder.js', matchData.matchID]);


// Execute Function
var execute = function(command, callback) {
    exec(command, function(error, stdout, stderr) {
    	callback(stderr);
    });
};

// Timer for Time Index
var setTime = function() {
    timeIndex += 10;
    var minutes = parseInt(timeIndex/60);
    var seconds = timeIndex%60;

    if(seconds == 0) {
    	seconds = '00';
    }

    return minutes + ":" + seconds;
}

// Master Controller
var masterControl = function() {
	setTimeout(function() {
		async.series([
		    function(callback){

		    	console.log('+ Exporing Images');
				
				var recordTime = setTime().trim();
				var captureCommand = 'ffmpeg -i video/' + matchData.matchID + '.mpeg -y -qscale 0 -r 2 -vframes 20 -ss 00:0' + recordTime + ' images/captures/%d.jpeg';
		        
		        execute(captureCommand, function() {
					console.log('+ Done Exporing Images')
					
					callback(null, '1');
				
				});

		    },
		    function(callback){
				// Create Queue Helper
				var q = async.queue(function (task, complete) {
					if(task.type == 'chop') {
						console.log('+ Chopping ' + task.name);
						var chopCommand = 'convert images/captures/' + task.imagenum + '.jpeg -crop ' + task.size + '+' + task.location + ' +repage images/global_items/' + task.imagenum + '_' + task.name + '.jpeg';
						execute(chopCommand, function() {
							complete(null);
						});
					}
				}, 1);


				// On Queue Completetion
				q.drain = function() {
				    console.log('+ All Items Have Been Processed');
				    callback(null, '2');
				}

				// Add Items to Queue
				for(var i = 1;i < 21;i++) {
					
					// Look for Victory
					q.push({imagenum: i, type: 'chop', name: 'Victory', size: '50x50', location: '605+460'}, function (err) {
					    console.log('+ Finished Chopping Victory');
					});

					// Look for P1 Charater
					q.push({imagenum: i, type: 'chop', name: 'P1Char', size: '30x30', location: '80+70'}, function (err) {
					    console.log('+ Finished Chopping Player 1 Charater');
					});

					// Look for P2 Charater
					q.push({imagenum: i, type: 'chop', name: 'P2Char', size: '30x30', location: '1165+70'}, function (err) {
					    console.log('+ Finished Chopping Player 2 Charater');
					});
				}
		  
		  
		    },
		    function(callback){
				// Create Queue Helper
				var q = async.queue(function (task, complete) {
					if (task.name == 'kill') {
						callback(null, 'kill');
					}

					console.log('+ Validating ' + task.name);

					if(task.name == 'P1Char') {
						var folder = P1Char;  
						for(var i = 0;i < folder.length;i++)
							(function(i) {
								var validateCommand = 'compare -metric AE -fuzz 20% assets/' + task.name + '/' + folder[i] + ' images/global_items/' + task.imagenum + '_' + task.name + '.jpeg null:';
								execute(validateCommand, function(output) {
									console.log(folder[i]);
									console.log(output);
									if(output < 50) {
										matchData.playerOneChar = folder[i];
										console.log(matchData.playerOneChar + ' IS IT!!!');
										complete(null);
									}
								});
						})(i);
					}

					if(task.name == 'Victory') {
						var validateCommand = 'compare -metric AE -fuzz 20% assets/global_items/' + task.name + '.jpeg images/global_items/' + task.imagenum + '_' + task.name + '.jpeg null:'
						execute(validateCommand, function(output) {
							complete(null, output);
						});
					}
				}, 1);


				// On Queue Completetion
				q.drain = function() {
				    console.log('+ All Items Have Been Processed');
				    callback(null, '3');
				}

				// Add Items to Queue
				for(var i = 1;i < 21;i++) {
					q.push({imagenum: i, type: 'validation', name: 'Victory'}, function (err, output) {
						if(parseInt(output) < 50) {
							q.unshift({name: 'kill'}, function (err) {
							});
						}
					    console.log('+ Finished Validating Victory');
					});

					if(matchData.playerOneChar == '') {
						q.push({imagenum: i, type: 'validation', name: 'P1Char'}, function (err, output) {
						    console.log('+ Finished Validating Player 1 Character');
						});
					}
				}	    	
		    }
		],
		function(err, results){
		    console.log(results);
		    if(results[2] == 'kill') {
			    exec('Taskkill /IM ffmpeg.exe /F', function(error, stdout, stderr) {
			    	recoder.kill();
			    	process.exit(code=0);
				});
		    }
		    //Restart Master Control 
			masterControl();

		});
	}, 10000);
}

masterControl();