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
		// Download via Bower
		fs.writeFile('.bowerrc', '{ "directory":"" }', function(error) {
			var webVersion = 'rocket';
			if (version) {
				webVersion = 'rocket#' + version;
				Rocket.log(colour.title('Downloading Rocket version '+ version +'...'));
			} else {
				Rocket.log(colour.title('Downloading the latest version of Rocket...'));
			}
			shell.exec('bower install ' + webVersion, function(code, stdout, stderr) {
				fs.unlinkSync('.bowerrc');
				fs.unlinkSync(path.join('rocket', '.bower.json'));
				fs.unlinkSync(path.join('rocket', '.gitignore'));
				fs.unlinkSync(path.join('rocket', 'bower.json'));
				if (code === 0) {
					Rocket.log(colour.command('Download: ') + colour.action(webVersion + '...') + colour.command('successful'));
					if (callback != undefined) {
						callback(webVersion);
					}
				} else {
					Rocket.log(colour.command('Download: ') + colour.action(webVersion + '...') + colour.error('failed'));
				}
			});
		});
	}
};
