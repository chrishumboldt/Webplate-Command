/**
 * File: lib/component.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var coffeeScript = require('coffee-script');
var colour = require('./colour');
var fs = require('fs');
var generate = require('./generate');
var message = require('./message');
var path = require('path');
var Rocket = require('rocket-tools');
var sass = require('node-sass');
var shell = require('shelljs');
var uglify = require('uglify-js');
var walker = require('dir-at-st');

var v = require('./variable');

// Execute
module.exports = {
	add: function(component) {
		if (v.dirName() === 'rocket') {
			shell.cd('engine');
			Rocket.log(colour.title('Downloading the component...'));
			var child = shell.exec('bower install ' + component, {
				async: true
			});
			// Output
			child.stdout.on('data', function(data) {
				Rocket.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				Rocket.log('Error: ' + colour.error(data));
			});
			child.on('close', function() {
				shell.cd('..');
				var rocketJsonPath = path.join(v.path.project.root, 'component', component, 'rocket.json');
				fs.readFile(rocketJsonPath, function(error, data) {
					Rocket.log('');
					Rocket.log(colour.command('Component: ') + colour.action(component) + colour.title(' has been added. Woohoo!'));
					Rocket.log(colour.text('You can view it under the project/components directory.'));
					if (error) {
						fs.writeFile(rocketJsonPath, generate.rocketJson(component), function (error) {
							if (error) {
								Rocket.log(colour.error(error));
							} else {
								Rocket.log('');
								Rocket.log(colour.warning('Warning: ') + colour.text('No rocket.json file found for ' + component + '.'));
								Rocket.log(colour.command('File: ') + colour.action(component + '/rocket.json...') + colour.command('created'));
								Rocket.log(colour.name('Note: ') + colour.text('Check the rocket.json "files" property.'));
								Rocket.log(colour.name('Note: ') + colour.text('Check that the "files" property references the production files required.'));
								Rocket.log(colour.name('Note: ') + colour.text('This could include minified CSS and/or Javascript.'));
								Rocket.log('');
							}
						});
					} else {
						Rocket.log('');
					}
				});
			});
		} else {
			message.rocket.dir.fail();
		}
	},
	build: function() {
		// Variables
		var allBuildFiles = [];
		// Functions
		var createOutpuFilePath = function (dir, filename, extOld, extNew) {
			var returnFilePath = path.join(dir, filename + extNew);
			// Check that CoffeeScript / TypeScript filenames don't clash with existing Javascript filenames
			if ((extOld === '.coffee' || extOld === '.ts') && allBuildFiles.indexOf('build/' + path.join(dir, filename + '.js')) > -1) {
				Rocket.log(colour.command('JS Conflict: ') + colour.action('Compiled ') + colour.name(filename + extOld) + colour.action(' conflicts with exsiting JS file. New filename is ') + colour.name(filename + extOld + extNew) + colour.action('.'));
				returnFilePath = path.join(dir, filename + extOld + extNew);
			}
			return returnFilePath;
		};
		var buildDirTree = function(filePath, fileExt, callback) {
			var filename = Rocket.string.remove.last(path.basename(filePath).replace(path.basename(filePath).split('.').pop(), ''));
			var baseDirString = (v.file.extension.sass.indexOf(fileExt) > -1) ? path.join('css') : path.join('js');
			var buildFolder = (v.file.extension.sass.indexOf(fileExt) > -1) ? 'sass' : 'js';
			var extensionOld = '.' + fileExt;
			var extensionNew = (v.file.extension.sass.indexOf(fileExt) > -1) ? '.min.css' : '.min.js';
			var subPath = filePath.replace(path.join('build', buildFolder), '').replace(filename + extensionOld, '').split('/').filter(function(path) {
				return path != '';
			});

			var makeDir = function(dir, len, i) {
				fs.mkdir(dir, function(error) {
					if ((len - 1) === i) {
						callback(filePath, createOutpuFilePath(dir, filename, extensionOld, extensionNew));
					}
				});
			};

			fs.mkdir(baseDirString, function(error) {
				if (subPath.length !== 0) {
					for (var i = 0, len = subPath.length; i < len; i++) {
						baseDirString = path.join(baseDirString, subPath[i]);
						makeDir(baseDirString, len, i);
					}
				} else {
					callback(filePath, createOutpuFilePath(baseDirString, filename, extensionOld, extensionNew), fileExt);
				}
			});
		};
		var buildJS = function(inFilePath, outFilePath, fileExt) {
			var js;
			switch (fileExt) {
				case 'coffee':
					var compiledCode = coffeeScript.compile(fs.readFileSync(inFilePath, { encoding: 'utf8' }));
					js = uglify.minify(compiledCode, {fromString: true}).code;
					break;
				default:
					js = uglify.minify(inFilePath, v.options.uglify).code;
			}

			if (js.length < 1) {
				Rocket.log(colour.command('JS: ') + colour.action(outFilePath + '...') + colour.error('fail (The JS file was empty)'));
				return false;
			}
			fs.writeFile(outFilePath, js, function(error) {
				if (error) {
					Rocket.log(colour.error(error));
				} else {
					Rocket.log(colour.command('JS: ') + colour.action(outFilePath + '...') + colour.command('successful'));
				}
			});
		};
		var buildSASS = function(inFilePath, outFilePath) {
			sass.render({
				file: inFilePath,
				outputStyle: 'compressed'
			}, function(error, result) {
				if (error) {
					Rocket.log(colour.error(error.message));
				} else {
					var css = result.css.toString();
					if (css.length > 0) {
						fs.writeFile(outFilePath, css, function(error) {
							if (error) {
								Rocket.log(colour.error(error));
							} else {
								Rocket.log(colour.command('CSS: ') + colour.action(outFilePath + '...') + colour.command('successful'));
							}
						});
					} else {
						Rocket.log(colour.command('CSS: ') + colour.action(outFilePath + '...') + colour.error('fail (The SASS file was empty)'));
					}
				}
			});
		};
		// Execute
		Rocket.log(colour.title('Building your Rocket component...'));
		walker({
			directory: path.join('build'),
			find: 'files'
		}, function(files) {
			allBuildFiles = files;
			for (var i = 0, len = files.length; i < len; i++) {
				var fileExt = Rocket.get.extension(files[i]);
				var filePrefix = path.basename(files[i]).charAt(0);

				if (v.file.ignore.prefix.indexOf(filePrefix) < 0) {
					if (v.file.extension.sass.indexOf(fileExt) > -1) {
						// SASS
						buildDirTree(files[i], fileExt, function(inFilePath, outFilePath) {
							buildSASS(inFilePath, outFilePath);
						});
					} else if (v.file.extension.js.indexOf(fileExt) > -1) {
						// JS / CoffeScript / TypeScript
						buildDirTree(files[i], fileExt, function(inFilePath, outFilePath, thisFileExt) {
							buildJS(inFilePath, outFilePath, thisFileExt);
						});
					}
				}
			}
		});
	},
	remove: function(component) {
		shell.cd('engine');
		Rocket.log(colour.title('Removing the component...'));
		var child = shell.exec('bower uninstall ' + component, {
			async: true
		});
		// Output
		child.stdout.on('data', function(data) {
			Rocket.log(data.trim());
		});
		child.stderr.on('data', function(data) {
			Rocket.log('Error: ' + colour.error(data));
		});
		child.on('close', function(code) {
			Rocket.log('');
			Rocket.log(colour.command('Component: ') + colour.action(component) + colour.title(' has been removed. Ahhhhhhhh.'));
			Rocket.log('');
		});
	}
};
