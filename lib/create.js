/**
 * File: lib/create.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var component = require('./component');
var download = require('./download');
var fs = require('fs');
var generate = require('./generate');
var path = require('path');
var Rocket = require('rocket-tools');
var shell = require('shelljs');

var v = require('./variable');

module.exports = {
	build: function (name, callback) {
		// Check if in Rocket
		if (v.dirName() === 'rocket') {
			this.buildInstance('project');
		} else {
			// Catch
			if (typeof name !== 'string' || typeof callback !== 'function') {
				return false;
			}
			this.buildInstance(name, name, callback);
		}
	},
	buildInstance: function (gotoFolder, name, callback) {
		// Go to folder
		if (typeof gotoFolder === 'string') {
			shell.cd(path.join(gotoFolder));
		}
		// Variables
		var name = (typeof name === 'string') ? name : 'app';
		var jsDone = false;
		var sassImportDone = false;
		var sassNameDone = false;
		var typeScriptConfigDone = false;
		// var typeScriptFileDone = false;
		var buildJSFolder = path.join('build', 'js');
		var buildJSFile = path.join(buildJSFolder, name + '.js');
		var buildSASSFolder = path.join('build', 'sass');
		var buildSASSImportFile = path.join(buildSASSFolder, '_import.scss');
		var buildSASSNameFile = path.join(buildSASSFolder, name + '.scss');
		var buildTSFolder = path.join('build', 'ts');
		var buildTSConfigFile = path.join(buildTSFolder, 'tsconfig.json');
		// var buildTSFile = path.join(buildTSFolder, name + '.ts');

		// Create folders
		shell.mkdir('-p', buildJSFolder);
		shell.mkdir('-p', buildSASSFolder);
		shell.mkdir('-p', buildTSFolder);
		Rocket.log(colour.command('Folder: ') + colour.action('build...') + colour.command('created'));

		// Functions
		var buildComponent = function () {
			if (typeof callback === 'function' && jsDone && sassNameDone && sassImportDone && typeScriptConfigDone) {
				return callback();
			}
		};

		// Create files
		fs.writeFile(buildJSFile, generate.codeStart(name, 'js'), function (error) {
			if (error) {
				Rocket.log(colour.error(error));
			} else {
				jsDone = true;
				Rocket.log(colour.command('File: ') + colour.action(buildJSFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
		fs.writeFile(buildSASSNameFile, generate.codeStart(name, 'sass-main'), function (error) {
			if (error) {
				Rocket.log(colour.error(error));
			} else {
				sassNameDone = true;
				Rocket.log(colour.command('File: ') + colour.action(buildSASSNameFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
		fs.writeFile(buildSASSImportFile, generate.codeStart(name, 'sass-import'), function (error) {
			if (error) {
				Rocket.log(colour.error(error));
			} else {
				sassImportDone = true;
				Rocket.log(colour.command('File: ') + colour.action(buildSASSImportFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
		fs.writeFile(buildTSConfigFile, generate.codeStart(name, 'typescript-config'), function (error) {
			if (error) {
				Rocket.log(colour.error(error));
			} else {
				typeScriptConfigDone = true;
				Rocket.log(colour.command('File: ') + colour.action(buildTSConfigFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
		// fs.writeFile(buildTSFile, generate.codeStart(name, 'typescript'), function (error) {
		// 	if (error) {
		// 		Rocket.log(colour.error(error));
		// 	} else {
		// 		typeScriptFileDone = true;
		// 		Rocket.log(colour.command('File: ') + colour.action(buildTSFile + '...') + colour.command('created'));
		// 		buildComponent();
		// 	}
		// });
	},
	component: function (name) {
		// Catch
		if (typeof name === 'undefined') {
			Rocket.log(colour.error('No component name provided.'));
			return false;
		}

		Rocket.log(colour.title('Creating a new Rocket component...'));
		shell.mkdir('-p', name);
		Rocket.log(colour.command('Folder: ') + colour.action(name + '...') + colour.command('created'));

		// Build instance
		this.build(name, function () {
			// Create files
			fs.writeFile('README.md', generate.readme(name), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					Rocket.log(colour.command('File: ') + colour.action('README.md...') + colour.command('created'));
				}
			});
			fs.writeFile('index.html', generate.indexComponent(name), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					Rocket.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
				}
			});
			component.build();
		});
	},
	project: function (name, version) {
		// Variables
		var self = this;

		// Functions
		var projectComplete = function () {
			Rocket.log(colour.text('Your project has been created. Build something out of this world!'));
		};

		// Execute
		if (name != undefined) {
			Rocket.log(colour.title('Creating a new Rocket project...'));

			shell.mkdir('-p', name);
			shell.cd(path.join(name));

			fs.writeFile('index.html', generate.indexHTML(), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					Rocket.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
					download.rocket(version, projectComplete);
				}
			});
		} else {
			Rocket.log(colour.error('No project name provided.'));
		}
	}
};
