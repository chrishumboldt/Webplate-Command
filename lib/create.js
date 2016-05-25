/**
 * File: lib/create.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

var colour = require('./colour');
var component = require('./component');
var download = require('./download');
var fs = require('fs');
var generate = require('./generate');
var path = require('path');
var shell = require('shelljs');
var web = require('webplate-tools');

var $v = require('./variable');

module.exports = {
	component: function ($name) {
		// Execute
		if ($name != undefined) {
			// Variables
			var $jsDone = false;
			var $sassNameDone = false;
			var $sassImportDone = false;
			var $buildJS = path.join('build', 'js', $name + '.js');
			var $buildSASSName = path.join('build', 'sass', $name + '.scss');
			var $buildSASSImport = path.join('build', 'sass', '_import.scss');

			// Functions
			var buildComponent = function () {
				if ($jsDone === true && $sassNameDone === true && $sassImportDone === true) {
					component.build();
				}
			};

			// Execute
			web.log(colour.title('Creating a new Webplate component...'));

			shell.mkdir('-p', $name);
			shell.cd(path.join($name));
			web.log(colour.command('Folder: ') + colour.action($name + '...') + colour.command('created'));

			// Create folders
			shell.mkdir('-p', 'build/js');
			shell.mkdir('-p', 'build/sass');
			web.log(colour.command('Folder: ') + colour.action('build...') + colour.command('created'));

			// Create files
			fs.writeFile('README.md', generate.readme($name), function ($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					web.log(colour.command('File: ') + colour.action('README.md...') + colour.command('created'));
				}
			});
			fs.writeFile('index.html', generate.indexComponent($name), function ($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					web.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
				}
			});
			fs.writeFile($buildJS, generate.codeStart($name, 'js'), function ($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					$jsDone = true;
					web.log(colour.command('File: ') + colour.action($buildJS + '...') + colour.command('created'));
					buildComponent();
				}
			});
			fs.writeFile($buildSASSName, generate.codeStart($name, 'sass-main'), function ($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					$sassNameDone = true;
					web.log(colour.command('File: ') + colour.action($buildSASSName + '...') + colour.command('created'));
					buildComponent();
				}
			});
			fs.writeFile($buildSASSImport, generate.codeStart($name, 'sass-import'), function ($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					$sassImportDone = true;
					web.log(colour.command('File: ') + colour.action($buildSASSImport + '...') + colour.command('created'));
					buildComponent();
				}
			});
		} else {
			web.log(colour.error('No component name provided.'));
		}
	},
	project: function ($name, $version) {
		// Variables
		var $self = this;

		// Functions
		var projectComplete = function () {
			web.log(colour.text('Your project has been created. Build something out of this world!'));
		};

		// Execute
		if ($name != undefined) {
			web.log(colour.title('Creating a new Webplate project...'));

			shell.mkdir('-p', $name);
			shell.cd(path.join($name));

			fs.writeFile('index.html', generate.indexHTML(), function ($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					web.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
					download.webplate($version, projectComplete);
				}
			});
		} else {
			web.log(colour.error('No project name provided.'));
		}
	}
};
