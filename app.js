var async = require('async');
var exec = require('child_process').exec;
var fs = require('fs');
var colors = require('colors');

// Logo and Version Info
console.log("================================================================".red);
console.log("____ ___ ____ ____ ____ ___    ____ _ ____ _  _ ___ ____ ____\n[__   |  |__/ |___ |___  |     |___ | | __ |__|  |  |___ |__/\n___]  |  |  \\ |___ |___  |     |    | |__] |  |  |  |___ |  \\\n");
console.log("                                                 Tracker V.0.1\n");
console.log("================================================================".red);

// Read Tesseract Ouput
function readFile(imageName) {
	fs.readFile(imageName, function(err, data) {
		if(err) throw err;
		console.log(imageName.substring(0,9) + ": " + data.toString().replace(/(\r\n|\n|\r)/gm,""));
	});
};

// Main Function
async.series([
	function(callback){
		exec("screenshot", function(err, stdout, stderr){
			console.log("Taking Screenshot" + "                                         (Done)".green);
			console.log("Converting Images for OCR" + "                                 (Done)".green);
			console.log("OCR Processing" + "                                            (Done)".green);
			console.log("================================================================".red);
			callback(null);
		});
	},
	function(callback){
		console.log("Reconized Players:".magenta);
		readFile('PlayerOne-Name.png.txt');
		readFile('PlayerTwo-Name.png.txt');
		callback(null);
	}
]);