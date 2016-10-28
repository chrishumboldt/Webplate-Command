/**
 * File: lib/component.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var coffeeScript = require('coffee-script');
var colour = require('./colour');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var sass = require('node-sass');
var shell = require('shelljs');
var uglify = require('uglify-js');
var walker = require('dir-at-st');
var Web = require('webplate-tools');

var v = require('./variable');

// Execute
module.exports = {
	add: function(component) {
		if (v.dirName() === 'webplate') {
			shell.cd('engine');
			Web.log(colour.title('Downloading the component...'));
			var child = shell.exec('bower install ' + component, {
				async: true
			});
			// Output
			child.stdout.on('data', function(data) {
				Web.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				Web.log('Error: ' + colour.error(data));
			});
			child.on('close', function() {
				Web.log('');
				Web.log(colour.command('Component: ') + colour.action(component) + colour.title(' has been added. Woohoo!'));
				Web.log(colour.text('You can view it under the project/components directory.'));
				Web.log('');
			});
		} else {
			message.webplate.dir.fail();
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
				Web.log(colour.command('JS Conflict: ') + colour.action('Compiled ') + colour.name(filename + extOld) + colour.action(' conflicts with exsiting JS file. New filename is ') + colour.name(filename + extOld + extNew) + colour.action('.'));
				returnFilePath = path.join(dir, filename + extOld + extNew);
			}
			return returnFilePath;
		};
		var buildDirTree = function(filePath, fileExt, callback) {
			var filename = Web.removeLast(path.basename(filePath).replace(path.basename(filePath).split('.').pop(), ''));
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
				Web.log(colour.command('JS: ') + colour.action(outFilePath + '...') + colour.error('fail (The JS file was empty)'));
				return false;
			}
			fs.writeFile(outFilePath, js, function(error) {
				if (error) {
					Web.log(colour.error(error));
				} else {
					Web.log(colour.command('JS: ') + colour.action(outFilePath + '...') + colour.command('successful'));
				}
			});
		};
		var buildSASS = function(inFilePath, outFilePath) {
			sass.render({
				file: inFilePath,
				outputStyle: 'compressed'
			}, function(error, result) {
				if (error) {
					Web.log(colour.error(error.message));
				} else {
					var css = result.css.toString();
					if (css.length > 0) {
						fs.writeFile(outFilePath, css, function(error) {
							if (error) {
								Web.log(colour.error(error));
							} else {
								Web.log(colour.command('CSS: ') + colour.action(outFilePath + '...') + colour.command('successful'));
							}
						});
					} else {
						Web.log(colour.command('CSS: ') + colour.action(outFilePath + '...') + colour.error('fail (The SASS file was empty)'));
					}
				}
			});
		};
		// Execute
		Web.log(colour.title('Building your Webplate component...'));
		walker({
			directory: path.join('build'),
			find: 'files'
		}, function(files) {
			allBuildFiles = files;
			for (var i = 0, len = files.length; i < len; i++) {
				var fileExt = Web.getExtension(files[i]);
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
	read: function(config, type, callback) {
		if (config !== false && config.build) {
			var callback = (typeof callback !== 'undefined') ? callback : false;
			var type = type || 'all';
			var project = {
				sass: [path.join('engine', 'build', 'sass', 'import.scss')],
				js: []
			};

			// Read the component files
			for (var i = 0, len = config.build.length; i < len; i++) {
				var build = config.build[i];
				if (build.component) {
					for (var i2 = 0, len2 = build.component.length; i2 < len2; i2++) {
						try {
							var data = fs.readFileSync(path.join(v.path.project.component, build.component[i2], '.bower.json'));
							var bower = JSON.parse(data);
							if (typeof bower.main == 'object') {
								for (var i3 = 0, len3 = bower.main.length; i3 < len3; i3++) {
									var includeFile = path.join(v.path.project.component, bower.name, bower.main[i3]);
									var includeFileExt = Web.getExtension(includeFile);
									if (includeFileExt === 'css' || includeFileExt === 'scss') {
										if (project.sass.indexOf(includeFile) == -1) {
											project.sass.push(includeFile);
										}
									} else if (includeFileExt === 'js') {
										if (project.js.indexOf(includeFile) == -1) {
											project.js.push(includeFile);
										}
									}
								}
							} else {
								var includeFile = path.join(v.path.project.component, bower.name, bower.main);
								var includeFileExt = Web.getExtension(includeFile);
								if (includeFileExt === 'css' || includeFileExt === 'scss') {
									if (project.sass.indexOf(includeFile) == -1) {
										project.sass.push(includeFile);
									}
								} else if (includeFileExt === 'js') {
									if (project.js.indexOf(includeFile) == -1) {
										project.js.push(includeFile);
									}
								}
							}
						} catch (error) {
							Web.log(colour.error(error));
						}
					}
				}
			}

			// Return
			if (callback !== false) {
				if (type === 'css') {
					callback(project.sass);
				} else if (type === 'js') {
					callback(project.js);
				} else {
					callback(project);
				}
			} else {
				return false;
			}
		} else {
			if (callback !== false) {
				callback(false);
			} else {
				return false;
			}
		}
	},
	remove: function(component) {
		shell.cd('engine');
		Web.log(colour.title('Removing the component...'));
		var child = shell.exec('bower uninstall ' + component, {
			async: true
		});
		// Output
		child.stdout.on('data', function(data) {
			Web.log(data.trim());
		});
		child.stderr.on('data', function(data) {
			Web.log('Error: ' + colour.error(data));
		});
		child.on('close', function(code) {
			Web.log('');
			Web.log(colour.command('Component: ') + colour.action(component) + colour.title(' has been removed. Ahhhhhhhh.'));
			Web.log('');
		});
	}
};
