/**
 * File: lib/component.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

// Requires
var colour = require('./log-colour');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var shell = require('shelljs');
var web = require('webplate-tools');

var $v = require('./variable');

// Execute
module.exports = {
	add: function($component) {
		if ($v.dirName() === 'webplate') {
			shell.cd('engine');
			web.log(colour.title('Downloading the component...'));
			var child = shell.exec('bower install ' + $component, {
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
				web.log(colour.command('Component: ') + colour.action($component) + colour.title(' has been added. Woohoo!'));
				web.log(colour.text('You can view it under the project/components directory.'));
				web.log('');
			});
		} else {
			message.webplate.dir.fail();
		}
	},
	read: function($config, $type, $callback) {
		if ($config !== false && $config.build) {
			var $callback = (typeof $callback !== 'undefined') ? $callback : false;
			var $type = $type || 'all';
			var $project = {
				sass: [path.join('engine', 'build', 'sass', 'import.scss')],
				js: []
			};

			// Read the component files
			for (var $i = 0, $len = $config.build.length; $i < $len; $i++) {
				var $build = $config.build[$i];
				if ($build.component) {
					for (var $i2 = 0, $len2 = $build.component.length; $i2 < $len2; $i2++) {
						try {
							var $data = fs.readFileSync(path.join($v.path.project.component, $build.component[$i2], '.bower.json'));
							var $bower = JSON.parse($data);
							if (typeof $bower.main == 'object') {
								for (var $i3 = 0, $len3 = $bower.main.length; $i3 < $len3; $i3++) {
									var $includeFile = path.join($v.path.project.component, $bower.name, $bower.main[$i3]);
									var $includeFileExt = web.getExtension($includeFile);
									if ($includeFileExt === 'css' || $includeFileExt === 'scss') {
										if ($project.sass.indexOf($includeFile) == -1) {
											$project.sass.push($includeFile);
										}
									} else if ($includeFileExt === 'js') {
										if ($project.js.indexOf($includeFile) == -1) {
											$project.js.push($includeFile);
										}
									}
								}
							} else {
								var $includeFile = path.join($v.path.project.component, $bower.name, $bower.main);
								var $includeFileExt = web.getExtension($includeFile);
								if ($includeFileExt === 'css' || $includeFileExt === 'scss') {
									if ($project.sass.indexOf($includeFile) == -1) {
										$project.sass.push($includeFile);
									}
								} else if ($includeFileExt === 'js') {
									if ($project.js.indexOf($includeFile) == -1) {
										$project.js.push($includeFile);
									}
								}
							}
						} catch ($error) {
							web.log(colour.error($error));
						}
					}
				}
			}

			// Return
			if ($callback !== false) {
				if ($type === 'css') {
					$callback($project.sass);
				} else if ($type === 'js') {
					$callback($project.js);
				} else {
					$callback($project);
				}
			} else {
				return false;
			}
		} else {
			if ($callback !== false) {
				$callback(false);
			} else {
				return false;
			}
		}
	},
	remove: function($component) {
		shell.cd('engine');
		web.log(colour.title('Removing the component...'));
		var child = shell.exec('bower uninstall ' + $component, {
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
			web.log(colour.command('Component: ') + colour.action($component) + colour.title(' has been removed. Ahhhhhhhh.'));
			web.log('');
		});
	}
};