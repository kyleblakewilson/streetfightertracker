var exec = require('child_process').exec;
var fs = require('fs');

exec("screenshot", function(err, stdout, stderr){
	console.log(stdout);
});