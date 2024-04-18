const fs = require('node:fs');

function saveImage(file,location, nombre){
	const newPath = `uploads/${location}/${nombre}`;
	fs.renameSync(file.path, newPath);
}


module.exports = {saveImage};