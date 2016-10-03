/**
 * File: lib/component.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var colour = require('./colour');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var sass = require('node-sass');
var shell = require('shelljs');
var uglify = require('uglify-js');
var walker = require('dir-at-st');
var web = require('webplate-tools');

var v = require('./variable');

// Execute
module.exports = {
	add: function(component) {
		if (v.dirName() === 'webplate') {
			shell.cd('engine');
			web.log(colour.title('Downloading the component...'));
			var child = shell.exec('bower install ' + component, {
				async: true
			});
			// Output
			child.stdout.on('data', function(data) {
				web.log(data.trim());
			});
			child.stderr.on('data', function(data) {
				web.log('Error: ' + colour.error(data));
			});
			child.on('close', function() {
				web.log('');
				web.log(colour.command('Component: ') + colour.action(component) + colour.title(' has been added. Woohoo!'));
				web.log(colour.text('You can view it under the project/components directory.'));
				web.log('');
			});
		} else {
			message.webplate.dir.fail();
		}
	},
	build: function() {
		// Functions
		var buildDirTree = function(filePath, type, callback) {
			var filename = web.removeLast(path.basename(filePath).replace(path.basename(filePath).split('.').pop(), ''));
			var baseDirString = (type === 'sass') ? path.join('css') : path.join('js');
			var buildFolder = (type === 'sass') ? 'sass' : 'js';
			var extensionOld = (type === 'sass') ? '.scss' : '.js';
			var extensionNew = (type === 'sass') ? '.min.css' : '.min.js';
			var subPath = filePath.replace(path.join('build', buildFolder), '').replace(filename + extensionOld, '').split('/').filter(function(path) {
				return path != '';
			});

			var makeDir = function(dir, len, i) {
				fs.mkdir(dir, function(error) {
					if ((len - 1) === i) {
						callback(filePath, path.join(dir, filename + extensionNew));
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
					callback(filePath, path.join(baseDirString, filename + extensionNew));
				}
			});
		};
		var buildJS = function(inFilePath, outFilePath) {
			var js = uglify.minify(inFilePath, v.options.uglify);
			fs.mkdir(path.join('js'), function() {
				if (js.code.length > 0) {
					fs.writeFile(outFilePath, js.code, function(error) {
						if (error) {
							web.log(colour.error(error));
						} else {
							web.log(colour.command('JS: ') + colour.action(outFilePath + '...') + colour.command('successful'));
						}
					});
				} else {
					web.log(colour.command('JS: ') + colour.action(outFilePath + '...') + colour.error('fail (The JS file was empty)'));
				}
			});
		};
		var buildSASS = function(inFilePath, outFilePath) {
			sass.render({
				file: inFilePath,
				outputStyle: 'compressed'
			}, function(error, result) {
				if (error) {
					web.log(colour.error(error.message));
				} else {
					var css = result.css.toString();
					if (css.length > 0) {
						fs.writeFile(outFilePath, css, function(error) {
							if (error) {
								web.log(colour.error(error));
							} else {
								web.log(colour.command('CSS: ') + colour.action(outFilePath + '...') + colour.command('successful'));
							}
						});
					} else {
						web.log(colour.command('CSS: ') + colour.action(outFilePath + '...') + colour.error('fail (The SASS file was empty)'));
					}
				}
			});
		};
		// Execute
		web.log(colour.title('Building your Webplate component...'));
		walker({
			directory: path.join('build'),
			find: 'files'
		}, function(files) {
			for (var i = 0, len = files.length; i < len; i++) {
				// SASS
				if (web.getExtension(files[i]) === 'scss' && path.basename(files[i]).substring(0, 1) !== '_') {
					buildDirTree(files[i], 'sass', function(inFilePath, outFilePath) {
						buildSASS(inFilePath, outFilePath);
					});
				} else if (web.getExtension(files[i]) === 'js') {
					buildDirTree(files[i], 'js', function(inFilePath, outFilePath) {
						buildJS(inFilePath, outFilePath);
					});
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
									var includeFileExt = web.getExtension(includeFile);
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
								var includeFileExt = web.getExtension(includeFile);
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
							web.log(colour.error(error));
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
		web.log(colour.title('Removing the component...'));
		var child = shell.exec('bower uninstall ' + component, {
			async: true
		});
		// Output
		child.stdout.on('data', function(data) {
			web.log(data.trim());
		});
		child.stderr.on('data', function(data) {
			web.log('Error: ' + colour.error(data));
		});
		child.on('close', function(code) {
			web.log('');
			web.log(colour.command('Component: ') + colour.action(component) + colour.title(' has been removed. Ahhhhhhhh.'));
			web.log('');
		});
	}
};
