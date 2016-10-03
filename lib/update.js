/**
 * File: lib/update.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var download = require('./download');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var web = require('webplate-tools');

var v = require('./variable');

module.exports = {
	engine: function (version) {
		fs.stat(path.join('webplate'), function (error) {
			if (error) {
				web.log(colour.command('Folder: ') + colour.action('webplate...') + colour.command('not found'));
				web.log(colour.text('You need to be in your project root and have access to the webplate folder as a sub-folder.'));
			} else {
				web.log(colour.title('Updating Webplate...'));

				var backupDir = path.join('backup-' + Date.now());

				shell.mv(path.join('webplate'), backupDir);
				web.log(colour.command('Backup: ') + colour.action(backupDir + '...') + colour.command('created'));

				download.webplate(version, function () {
					shell.rm('-rf', path.join('webplate', 'project'));
					shell.cp('-R', path.join(backupDir, 'project'), path.join('webplate'));
					web.log(colour.command('Copy: ') + colour.action(backupDir + '/project folder to webplate...') + colour.command('successful'));
				});
			}
		});
	}
};
