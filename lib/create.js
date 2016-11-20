/**
 * File: lib/create.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var build = require('./build');
var cockpit = require('./cockpit');
var colour = require('./colour');
var download = require('./download');
var fs = require('fs');
var generate = require('./generate');
var message = require('./message');
var path = require('path');
var Rocket = require('rocket-tools');
var shell = require('shelljs');

var v = require('./variable');

module.exports = {
	build: function (gotoFolder, name, callback) {
		// Go to folder
		if (Rocket.is.string(gotoFolder)) {
			shell.cd(path.join(gotoFolder));
		}
		var name = (Rocket.is.string(name)) ? name : 'my-module-name';
		// Check for directory
		build.hasDirectory({
			name: 'build',
			message: false
		}, function (response) {
			// Catch
			if (response) {
				message.rocket.build.exists();
				return false;
			}
			// Continue
			// Variables
			var done = {
				cockpit: false,
				js: false,
				sassImport: false,
				sassName: false,
				typeScriptConfig: false
			};
			var buildCockpitFile = path.join('cockpit.json');
			var buildJSFolder = path.join('build', 'js');
			var buildJSFile = path.join(buildJSFolder, name + '.js');
			var buildSASSFolder = path.join('build', 'sass');
			var buildSASSImportFile = path.join(buildSASSFolder, '_import.scss');
			var buildSASSNameFile = path.join(buildSASSFolder, name + '.scss');
			var buildTSFolder = path.join('build', 'ts');
			var buildTSConfigFile = path.join(buildTSFolder, 'tsconfig.json');
			var nameClean = name.replace(/-/g, '');

			message.rocket.create.build();

			// Create folders
			shell.mkdir('-p', buildJSFolder);
			shell.mkdir('-p', buildSASSFolder);
			shell.mkdir('-p', buildTSFolder);
			Rocket.log(colour.command('Folder: ') + colour.action('build...') + colour.command('created'));

			// Functions
			var buildModule = function () {
				// Catch
				if (!Rocket.is.function(callback)) {
					return false;
				}
				// Continue
				if (done.cockpit && done.js && done.sassName && done.sassImport && done.typeScriptConfig) {
					return callback();
				}
			};

			// Create files
			fs.stat(buildCockpitFile, function (noFile) {
	         if (noFile) {
					// Create cockpit
					fs.writeFile(buildCockpitFile, generate.cockpitJSON(name), function (error) {
						if (error) {
							Rocket.log(colour.error(error));
						} else {
							done.cockpit = true;
							Rocket.log(colour.command('File: ') + colour.action(buildCockpitFile + '...') + colour.command('created'));
							buildModule();
						}
					});
	         } else {
					done.cockpit = true;
				}
			});
			fs.writeFile(buildJSFile, generate.moduleJS(name), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					done.js = true;
					Rocket.log(colour.command('File: ') + colour.action(buildJSFile + '...') + colour.command('created'));
					buildModule();
				}
			});
			fs.writeFile(buildSASSNameFile, generate.sassMain(name), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					done.sassName = true;
					Rocket.log(colour.command('File: ') + colour.action(buildSASSNameFile + '...') + colour.command('created'));
					buildModule();
				}
			});
			fs.writeFile(buildSASSImportFile, generate.sassImport(), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					done.sassImport = true;
					Rocket.log(colour.command('File: ') + colour.action(buildSASSImportFile + '...') + colour.command('created'));
					buildModule();
				}
			});
			fs.writeFile(buildTSConfigFile, generate.typescriptConfig(), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					done.typeScriptConfig = true;
					Rocket.log(colour.command('File: ') + colour.action(buildTSConfigFile + '...') + colour.command('created'));
					buildModule();
				}
			});
		});
	},
	rcModule: function (name) {
		// Catch
		if (typeof name === 'undefined') {
			message.rocket.rcModule.noName();
			return false;
		}
		// Continue
		message.rocket.rcModule.create();
		shell.mkdir('-p', name);
		Rocket.log(colour.command('Folder: ') + colour.action(name + '...') + colour.command('created'));

		// Build instance
		this.build(name, name, function () {
			// Create files
			fs.writeFile('README.md', generate.readme(name), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					Rocket.log(colour.command('File: ') + colour.action('README.md...') + colour.command('created'));
				}
			});
			fs.writeFile('index.html', generate.moduleIndex(name), function (error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					Rocket.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
				}
			});
			build.all();
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
			message.rocket.project.create();

			shell.mkdir('-p', name);
			shell.cd(path.join(name));

			fs.writeFile('index.html', generate.htmlIndex(), function (error) {
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
