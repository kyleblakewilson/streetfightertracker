var im = require('imagemagick');
var nodecr = require('node-tesseract');

// ImageMagik Processing
function screenshot(cropSize, outputName) {
	im.convert(['screenshot.jpg', '-crop', cropSize, '+repage', outputName + '.jpg'], 
	function(err, stdout){
	  if (err) throw err;
	  console.log('Cropped ' + outputName);
	});
};

// Tesseract Processing
function tesseract(imageName) {
	nodecr.process(__dirname + '\\' + imageName,function(err, text) {
		if(err) {
			console.error(err);
		} else {
			console.log(text);
		}
	});
};


// Screenshot Functions
screenshot('250x24+121+138', 'PlayerOne-Name');
screenshot('250x24+944+138', 'PlayerTwo-Name');
//screenshot('118x28+412+44', 'Wins');
//screenshot('225x30+115+115', 'PlayerOne-Char');
//screenshot('225x30+940+115', 'PlayerTwo-Char');

// Tesseract Functions
tesseract('PlayerOne-Name.jpg');
tesseract('PlayerTwo-Name.jpg');