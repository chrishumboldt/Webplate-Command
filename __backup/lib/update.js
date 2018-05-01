/*
Author: Chris Humboldt
*/

'use strict';

const colour = require('./colour');
const download = require('./download');
const fs = require('fs');
const path = require('path');
const Rocket = require('rocket-tools');
const shell = require('shelljs');

const v = require('./variable');

module.exports = {
	engine: function (version) {
		fs.stat(path.join('rocket'), function (error) {
			if (error) {
				Rocket.log(colour.command('Folder: ') + colour.action('rocket...') + colour.command('not found'));
				Rocket.log(colour.text('You need to be in your project root and have access to the rocket folder as a sub-folder.'));
			} else {
				Rocket.log(colour.title('Updating Rocket...'));

				var backupDir = path.join('backup-' + Date.now());

				shell.mv(path.join('rocket'), backupDir);
				Rocket.log(colour.command('Backup: ') + colour.action(backupDir + '...') + colour.command('created'));

				download.rocket(version, function () {
					shell.rm('-rf', path.join('rocket', 'project'));
					shell.cp('-R', path.join(backupDir, 'project'), path.join('rocket'));
					Rocket.log(colour.command('Copy: ') + colour.action(backupDir + '/project folder to rocket...') + colour.command('successful'));
				});
			}
		});
	}
};
