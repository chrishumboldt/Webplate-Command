/**
 * File: lib/download.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var web = require('webplate-tools');

module.exports = {
	webplate: function(version, callback) {
		// Download via Bower
		fs.writeFile('.bowerrc', '{ "directory":"" }', function(error) {
			var webVersion = 'webplate';
			if (version) {
				webVersion = 'webplate#' + version;
				web.log(colour.title('Downloading Webplate version '+ version +'...'));
			} else {
				web.log(colour.title('Downloading the latest version of Webplate...'));
			}
			shell.exec('bower install ' + webVersion, function(code, stdout, stderr) {
				fs.unlinkSync('.bowerrc');
				fs.unlinkSync(path.join('webplate', '.bower.json'));
				fs.unlinkSync(path.join('webplate', '.gitignore'));
				fs.unlinkSync(path.join('webplate', 'bower.json'));
				if (code === 0) {
					web.log(colour.command('Download: ') + colour.action(webVersion + '...') + colour.command('successful'));
					if (callback != undefined) {
						callback(webVersion);
					}
				} else {
					web.log(colour.command('Download: ') + colour.action(webVersion + '...') + colour.error('failed'));
				}
			});
		});
	}
};
