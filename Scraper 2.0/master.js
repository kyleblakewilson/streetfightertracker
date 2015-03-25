var spawn = require('child_process').spawn;

// Begin New Match
function startMatch() {
	var child = spawn('node', ['processer.js']);
	console.log('+ Starting New Match');

	// End Existing Match
	child.on('exit', function(){
		child.kill();
		console.log('+ Match Complete');
		//startMatch();
	});

	// Output Console Text
	child.stdout.on('data', function (data) {
    	var processerOuput = data.toString().trim();
	  	console.log('' + processerOuput);
	});
	 
	//Output Console Errors
	child.stderr.on('data', function (data) {
	  console.log('' + data);
	});

}

startMatch();