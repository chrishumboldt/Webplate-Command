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
var shell = require('shelljs');
var Web = require('webplate-tools');

var v = require('./variable');

module.exports = {
	build: function (name, callback) {
		// Check if in Webplate
		if (v.dirName() === 'webplate') {
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
		var typeScriptFileDone = false;
		var buildJSFolder = path.join('build', 'js');
		var buildJSFile = path.join(buildJSFolder, name + '.js');
		var buildSASSFolder = path.join('build', 'sass');
		var buildSASSImportFile = path.join(buildSASSFolder, '_import.scss');
		var buildSASSNameFile = path.join(buildSASSFolder, name + '.scss');
		var buildTSFolder = path.join('build', 'ts');
		var buildTSConfigFile = path.join(buildTSFolder, 'tsconfig.json');
		var buildTSFile = path.join(buildTSFolder, name + '.ts');

		// Create folders
		shell.mkdir('-p', buildJSFolder);
		shell.mkdir('-p', buildSASSFolder);
		shell.mkdir('-p', buildTSFolder);
		Web.log(colour.command('Folder: ') + colour.action('build...') + colour.command('created'));

		// Functions
		var buildComponent = function () {
			if (typeof callback === 'function' && jsDone && sassNameDone && sassImportDone && typeScriptConfigDone && typeScriptFileDone) {
				return callback();
			}
		};

		// Create files
		fs.writeFile(buildJSFile, generate.codeStart(name, 'js'), function (error) {
			if (error) {
				Web.log(colour.error(error));
			} else {
				jsDone = true;
				Web.log(colour.command('File: ') + colour.action(buildJSFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
		fs.writeFile(buildSASSNameFile, generate.codeStart(name, 'sass-main'), function (error) {
			if (error) {
				Web.log(colour.error(error));
			} else {
				sassNameDone = true;
				Web.log(colour.command('File: ') + colour.action(buildSASSNameFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
		fs.writeFile(buildSASSImportFile, generate.codeStart(name, 'sass-import'), function (error) {
			if (error) {
				Web.log(colour.error(error));
			} else {
				sassImportDone = true;
				Web.log(colour.command('File: ') + colour.action(buildSASSImportFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
		fs.writeFile(buildTSConfigFile, generate.codeStart(name, 'typescript-config'), function (error) {
			if (error) {
				Web.log(colour.error(error));
			} else {
				typeScriptConfigDone = true;
				Web.log(colour.command('File: ') + colour.action(buildTSConfigFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
		fs.writeFile(buildTSFile, generate.codeStart(name, 'typescript'), function (error) {
			if (error) {
				Web.log(colour.error(error));
			} else {
				typeScriptFileDone = true;
				Web.log(colour.command('File: ') + colour.action(buildTSFile + '...') + colour.command('created'));
				buildComponent();
			}
		});
	},
	component: function (name) {
		// Catch
		if (typeof name === 'undefined') {
			Web.log(colour.error('No component name provided.'));
			return false;
		}

		Web.log(colour.title('Creating a new Webplate component...'));
		shell.mkdir('-p', name);
		Web.log(colour.command('Folder: ') + colour.action(name + '...') + colour.command('created'));

		// Build instance
		this.build(name, function () {
			// Create files
			fs.writeFile('README.md', generate.readme(name), function (error) {
				if (error) {
					Web.log(colour.error(error));
				} else {
					Web.log(colour.command('File: ') + colour.action('README.md...') + colour.command('created'));
				}
			});
			fs.writeFile('index.html', generate.indexComponent(name), function (error) {
				if (error) {
					Web.log(colour.error(error));
				} else {
					Web.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
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
			Web.log(colour.text('Your project has been created. Build something out of this world!'));
		};

		// Execute
		if (name != undefined) {
			Web.log(colour.title('Creating a new Webplate project...'));

			shell.mkdir('-p', name);
			shell.cd(path.join(name));

			fs.writeFile('index.html', generate.indexHTML(), function (error) {
				if (error) {
					Web.log(colour.error(error));
				} else {
					Web.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
					download.webplate(version, projectComplete);
				}
			});
		} else {
			Web.log(colour.error('No project name provided.'));
		}
	}
};
