var exec = require('child_process').exec;
var async = require('async');
var fs = require('fs');
var validateConfig;
var p1Char = fs.readdirSync('images/static/player1');
var p2Char = fs.readdirSync('images/static/player2');

// Config Path
var file = __dirname + '/live_matchinfo.json';

console.log('|| Validate: Starting');

// Start Validate Process, Read Config File
// fs.readFile(file, 'utf8', function (err, data) {
//   	if (err) {
//     	console.log('Error: ' + err);
//     	return;
//   	}

//   	validateConfig = JSON.parse(data);

//   	var rounds = [];
//   	for(var i = 1;i < 21;i++) {
// 		rounds.push(i);
// 	}

// 	async.eachSeries(rounds, validate, function(err){
// 		fs.writeFile('live_matchinfo.json', JSON.stringify(validateConfig), function (err) {
	  		
// 	  	});
// 	});
// });

async.waterfall([
    function(callback) {
    	fs.readFile(file, 'utf8', function (err, data) {
        	validateConfig = JSON.parse(data);
	        callback(null);
	    });
    },
    function(callback){
    	// genSpecs(function(specs){
    	// 	callback(null, specs);
    	// });
		callback(null);
    },
    function(specs, callback){
		// async.eachSeries(specs, specDirector, function(err){
		// 	callback(null);
		// });
		callback(null);
    }
], function (err, result) {
   // nothing yet 
});

function specDirector(spec, callback) {
	if(name == 'playerone_char'){
		player1Character(spec, function(){
			callback();
		});
	} else if(name == 'victory') {
		// nothing yet
	} else {
		callback();
	}
}

function genSpecs(callback) {
	var specs = [];
	for(var i = 0;i < validateConfig.length;i++) {
		if(validateConfig[i].verfied == false && validateConfig[i].name) {
			specs.push([{name: validateConfig[i].name, location: validateConfig[i].location}]);
		}
	}
	callback(specs);
} 

// Rules
function player1Character(spec, callback) {
	var characterSpec = [];
	for(var i = 0;i < p1Char.length;i++) {
		characterSpec.push({"staticimage": p1Char[i], "name": spec.name, "location": spec.location});
	}

	async.eachSeries(characterSpec, imageCompare, function(err){
		callback(null);
	});

}