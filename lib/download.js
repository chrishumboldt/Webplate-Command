/**
 * File: lib/download.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var fs = require('fs');
var path = require('path');
var Rocket = require('rocket-tools');
var shell = require('shelljs');

module.exports = {
	rocket: function(version, callback) {
		// Download
		var rocketVersion  = 'rocket-framework';
		if (version) {
			rocketVersion  += '@' + version;
			Rocket.log(colour.title('Downloading Rocket version '+ version +'...'));
		} else {
			Rocket.log(colour.title('Downloading the latest version of Rocket...'));
		}
		shell.exec('npm install ' + rocketVersion , function(code, stdout, stderr) {
			fs.unlinkSync(path.join('rocket', '.gitignore'));
			fs.unlinkSync(path.join('rocket', 'package.json'));
			fs.unlinkSync(path.join('rocket', 'README.md'));
			if (code === 0) {
				Rocket.log(colour.command('Download: ') + colour.action(rocketVersion  + '...') + colour.command('successful'));
				if (callback != undefined) {
					callback(rocketVersion );
				}
			} else {
				Rocket.log(colour.command('Download: ') + colour.action(rocketVersion  + '...') + colour.error('failed'));
			}
		});
	}
};
