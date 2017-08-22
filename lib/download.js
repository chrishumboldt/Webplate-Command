/*
Author: Chris Humboldt
*/

'use strict';

const colour = require('./colour');
const fs = require('fs');
const path = require('path');
const Rocket = require('rocket-tools');
const shell = require('shelljs');

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
			shell.mv(path.join('node_modules', 'rocket-framework'), path.join('rocket'));
			fs.rmdir(path.join('node_modules'));
			fs.unlinkSync(path.join('rocket', '.npmignore'));
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
