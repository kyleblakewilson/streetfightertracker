var exec = require('child_process').exec;
var async = require('async');
var fs = require('fs');
var cropConfig;

// Cofig Path
var file = __dirname + '/live_matchinfo.json';


// Start Crop Process, Read Config File
fs.readFile(file, 'utf8', function (err, data) {
  	if (err) {
    	console.log('Error: ' + err);
    	return;
  	}

  	cropConfig = JSON.parse(data);

  	var rounds = [];
  	for(var i = 1;i < 21;i++) {
		rounds.push(i);
	}

  	//The Funiest Fuction in The World
	async.eachSeries(rounds, crop, function(err){

	});
});

console.log('|| Crop: Starting');

function cropCommand(specs, callback) {
	var name = specs[0].name;
	var round = specs[0].round;
	var location = specs[0].location;
	var size = specs[0].size;
	var position = specs[0].position;
	exec('convert images/capture/frames/' + round + '.png -crop ' + size + '+' + position + ' +repage images/capture/' + location + '/' + round + '_' + name + '.png', function(error, stdout, stderr) {
		callback();
	});
}

function crop(roundnum, callback) {
	var specs = [];
	for(var i = 0;i < cropConfig.length;i++) {
		if(cropConfig[i].verfied == false && cropConfig[i].name) {
			specs.push([{name: cropConfig[i].name, round: roundnum, location: cropConfig[i].location, size: cropConfig[i].size, position: cropConfig[i].position}])
		}
	}
	async.eachSeries(specs, cropCommand, function(err){
		callback();
	});
}