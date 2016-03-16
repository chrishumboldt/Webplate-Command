#!/usr/bin/env node

/**
 * File: index.js
 * Type: Javascript index file
 * Author: Chris Humboldt
 */

'use strict';

// Table of contents
// Requires
// Variables
// Setup console colours
// Functions
// Execute

// Requires
var chalk = require('chalk');
var chokidar = require('chokidar');
var fs = require('fs');
var livereload = require('livereload');
var sass = require('node-sass');
var shell = require('shelljs');
var uglify = require('uglify-js');

// Variables
var $arguments = process.argv.slice(2);
var $building = false;
var $command = $arguments[0];
var $config;
var $currentPath = process.cwd();
var $html = '';
var $optionsUglify = {
	mangle: true,
	compress: {
		sequences: true,
		dead_code: true,
		conditionals: true,
		booleans: true,
		unused: true,
		if_return: true,
		join_vars: true,
		drop_console: false
	}
};
var $path = {
	engine: {
		root: './engine/',
		component: './engine/component/',
		css: './engine/css/',
		js: './engine/js/',
		jsSrc: './engine/js/src/',
		sass: './engine/sass/'
	},
	project: {
		root: './project/',
		component: './project/component/',
		css: './project/css/',
		js: './project/js/',
		sass: './project/sass/',
	}
};

var $dirName = ($currentPath).substr($currentPath.lastIndexOf('/') + 1);
var $jsFilesEngineScripts = [
    $path.engine.jsSrc + 'modernizr.js',
    $path.engine.jsSrc + 'velocity.js',
    $path.engine.component + 'buttonplate/js/buttonplate.js',
    $path.engine.component + 'flickerplate/js/flickerplate.js',
    $path.engine.component + 'formplate/js/formplate.js',
    $path.engine.component + 'injectplate/js/injectplate.js',
    $path.engine.component + 'loaderplate/js/loaderplate.js',
    $path.engine.component + 'menuplate/js/menuplate.js',
    $path.engine.component + 'messageplate/js/messageplate.js',
    $path.engine.component + 'modalplate/js/modalplate.js',
    $path.engine.component + 'tabplate/js/tabplate.js',
    $path.engine.jsSrc + 'tools.js',
    $path.engine.jsSrc + 'overwrite.js'
];
var $jsFilesEngineStart = [
    $path.engine.jsSrc + 'core.js'
];
var $jsFilesEngineTouch = [
    $path.engine.jsSrc + 'fastclick.js'
];
var $project = {
	sass: [$path.engine.sass + 'import.scss'],
	js: [],
	watch: ['./project/sass/', './project/js/src']
};

// Setup console colours
var chalkAction = chalk.cyan;
var chalkCommand = chalk.magenta;
var chalkError = chalk.red;
var chalkText = chalk.green;
var chalkTitle = chalk.yellow;
var chalkNumber = chalk.yellow;
var chalkOption = chalk.cyan;
var chalkWarning = chalk.yellow;

// Functions
var buildCSS = function() {
	console.log(chalkTitle('Starting your CSS build...'));
	// Project CSS
	if ($config.build) {
		for (var $i = 0, $len = $config.build.length; $i < $len; $i++) {
			var $build = $config.build[$i];
			var $fileData = '';
			// SASS
			if ($build.sass) {
				for (var $i2 = 0, $len2 = $build.sass.length; $i2 < $len2; $i2++) {
					if (checkExtension($build.sass[$i2], 'scss') || checkExtension($build.sass[$i2], 'css')) {
						if ($project.sass.indexOf($path.project.sass + $build.sass[$i2]) == -1) {
							$project.sass.push($path.project.sass + $build.sass[$i2]);
						}
					}
				}
			}
			for (var $i2 = 0, $len2 = $project.sass.length; $i2 < $len2; $i2++) {
				var $data = fs.readFileSync($project.sass[$i2]).toString();
				if ($project.sass[$i2] == ($path.engine.sass + 'import.scss')) {
					$fileData += $data.replace(new RegExp('@import "', 'g'), '@import "./engine/sass/');
				} else if ($project.sass[$i2].indexOf('.scss') > -1) {
					if ($project.sass[$i2].indexOf('component') > -1) {
						$fileData += $data.replace(new RegExp('@import "', 'g'), '@import "./project/component/');
					} else {
						$fileData += $data.replace(new RegExp('@import "', 'g'), '@import "./project/sass/');
					}
				} else {
					$fileData += $data;
				}
			}
			sass.render({
				data: $fileData,
				outputStyle: 'compressed'
			}, function($error, $result) {
				if ($error) {
					console.log(chalkError($error.message));
				} else {
					var $css = $result.css.toString();
					fs.writeFile($path.project.css + $build.name + '.min.css', $css, function($error) {
						if ($error) {
							console.log(chalkError($error));
						} else {
							console.log(chalkCommand('CSS: ') + chalkAction('project/' + $build.name + '.min.css...') + chalkCommand('successful'));
						}
					});
				}
			});
		}
	}
};
var buildEngine = function() {
	console.log(chalkTitle('Starting to rebuild engine...'));
	// Engine CSS
	sass.render({
		file: './engine/sass/styles.scss',
		outputStyle: 'compressed'
	}, function($error, $result) {
		if ($error) {
			console.log(chalkError($error.message));
		} else {
			var $css = $result.css.toString();
			fs.writeFile($path.engine.css + 'styles.min.css', $css, function($error) {
				if ($error) {
					console.log(chalkError($error));
				} else {
					console.log(chalkCommand('CSS: ') + chalkAction('engine/styles.min.css...') + chalkCommand('successful'));
				}
			});
		}
	});
	// Engine scripts
	var $engineScriptJS = uglify.minify($jsFilesEngineScripts, $optionsUglify);
	fs.writeFile($path.engine.js + 'scripts.min.js', $engineScriptJS.code, function($error) {
		if ($error) {
			console.log(chalkError($error));
		} else {
			console.log(chalkCommand('JS: ') + chalkAction('engine/scripts.min.js...') + chalkCommand('successful'));
		}
	});
	// Engine start
	var $engineStartJS = uglify.minify($jsFilesEngineStart, $optionsUglify);
	fs.writeFile('./start.js', $engineStartJS.code, function($error) {
		if ($error) {
			console.log(chalkError($error));
		} else {
			console.log(chalkCommand('JS: ') + chalkAction('start.js...') + chalkCommand('successful'));
		}
	});
	// Engine touch
	var $engineTouchJS = uglify.minify($jsFilesEngineTouch, $optionsUglify);
	fs.writeFile($path.engine.js + 'touch.min.js', $engineTouchJS.code, function($error) {
		if ($error) {
			console.log(chalkError($error));
		} else {
			console.log(chalkCommand('JS: ') + chalkAction('engine/touch.min.js...') + chalkCommand('successful'));
		}
	});
};
var buildJS = function() {
	console.log(chalkTitle('Starting your JS build...'));
	// Project scripts
	if ($config.build) {
		for (var $i = 0, $len = $config.build.length; $i < $len; $i++) {
			var $build = $config.build[$i];
			if ($build.js) {
				for (var $i2 = 0, $len2 = $build.js.length; $i2 < $len2; $i2++) {
					if (checkExtension($build.js[$i2], 'js')) {
						if ($project.js.indexOf($path.project.js + $build.js[$i2]) == -1) {
							$project.js.push($path.project.js + $build.js[$i2]);
						}
					}
				}
				if ($project.js.length > 0) {
					var $projectJS = uglify.minify($project.js, $optionsUglify);
					fs.writeFile($path.project.js + $build.name + '.min.js', $projectJS.code, function($error) {
						if ($error) {
							console.log(chalkError($error));
						} else {
							console.log(chalkCommand('JS: ') + chalkAction('project/js/' + $build.name + '.min.js...') + chalkCommand('successful'));
						}
					});
				}
			}
		}
	}
};
var checkExtension = function($file, $ext) {
	return ($file.split('.').pop().toLowerCase() === $ext.toLowerCase()) ? true : false;
};
var readConfig = function() {
	var $configFile = fs.readFileSync($path.project.root + 'config.json'); // Read config file first
	$config = JSON.parse($configFile);
};
var readComponents = function($callback) {
	var $callback = (typeof $callback !== 'undefined') ? $callback : false;

	if ($config.build) {
		for (var $i = 0, $len = $config.build.length; $i < $len; $i++) {
			var $build = $config.build[$i];
			if ($build.component) {
				for (var $i2 = 0, $len2 = $build.component.length; $i2 < $len2; $i2++) {
					try {
						var $data = fs.readFileSync($path.project.component + $build.component[$i2] + '/.bower.json');
						var $bower = JSON.parse($data);
						if (typeof $bower.main == 'object') {
							for (var $i3 = 0, $len3 = $bower.main.length; $i3 < $len3; $i3++) {
								var $includeFile = $path.project.component + $build.component[$i2] + '/' + $bower.main[$i3];
								if ($project.sass.indexOf($includeFile) == -1 || $project.js.indexOf($includeFile) == -1) {
									if (checkExtension($includeFile, 'css') || checkExtension($includeFile, 'scss')) {
										$project.sass.push($includeFile);
									} else if (checkExtension($includeFile, 'js')) {
										$project.js.push($includeFile);
									}
								}
							}
						} else {
							var $includeFile = $path.project.component + $build.component[$i2] + '/' + $bower.main;
							if ($project.sass.indexOf($includeFile) == -1 || $project.js.indexOf($includeFile) == -1) {
								if (checkExtension($includeFile, 'css') || checkExtension($includeFile, 'scss')) {
									$$project.sass.push($includeFile);
								} else if (checkExtension($includeFile, 'js')) {
									$project.js.push($includeFile);
								}
							}
						}
					} catch ($error) {
						console.log(chalkError($error));
					}
				}
			}
		}
	}
	if ($callback !== false) {
		$callback();
	}
};
var webplateDirCheck = function() {
	if ($dirName !== 'webplate') {
		console.log('');
		console.log(chalkWarning.bold('Warning:') + chalkWarning(' You are not in a webplate directory.'));
		console.log(chalkAction('All webplate commands need to be run from it.'));
		console.log('');
		return false;
	} else {
		readConfig();
		return true;
	}
};

// Execute
switch ($command) {

	case 'build':
		if (webplateDirCheck() === true) {
			readComponents(function() {
				if ($arguments[1] === 'css') {
					buildCSS();
				} else if ($arguments[1] === 'js') {
					buildJS();
				} else if ($arguments[1] === 'engine') {
					buildEngine();
				} else {
					buildCSS();
					buildJS();
				}
			});
		}
		break;

	case 'component':
		if (webplateDirCheck() === true) {
			if (($arguments[1] === 'add') && ($arguments[2])) {
				shell.cd('engine');
				console.log(chalkTitle('Downloading the component...'));
				var child = shell.exec('bower install ' + $arguments[2], {
					async: true
				});
				// Output
				child.stdout.on('data', function(data) {
					console.log(data.trim());
				});
				child.stderr.on('data', function(data) {
					console.log('Error: ' + chalkError(data));
				});
				child.on('close', function() {
					console.log(chalkTitle('The component has been added!'));
					console.log(chalkText('You can view it under the project/components directory.'));
				});
			} else if (($arguments[1] === 'remove') && ($arguments[2])) {
				shell.cd('engine');
				console.log(chalkTitle('Removing the component...'));
				var child = shell.exec('bower uninstall ' + $arguments[2], {
					async: true
				});
				// Output
				child.stdout.on('data', function(data) {
					console.log(data.trim());
				});
				child.stderr.on('data', function(data) {
					console.log('Error: ' + chalkError(data));
				});
				child.on('close', function(code) {
					console.log(chalkCommand('The component has been removed. Ahhhhh.'));
				});
			} else {
				console.log('');
				console.log(chalkTitle('Sorry but what Bower component do you want to install?'));
				console.log('webplate component add ' + chalkOption('<bower_component>'));
				console.log('');
			}
		}
		break;

	case 'create':
		break;

	case 'download':
		break;

	case 'watch':
		if (webplateDirCheck() === true) {
			readComponents(function() {
				console.log(chalkTitle('Watching your project SASS and JS...'));
				var watcher = chokidar.watch($project.watch, {
					ignored: /^\./,
					persistent: true
				});
				watcher.on('change', function($path) {
					if ($building === false) {
						$building = true;
						console.log('');
						console.log(chalkAction($path) + chalkCommand(' updated'));
						if (checkExtension($path, 'scss')) {
							buildCSS();
						}
						if (checkExtension($path, 'js')) {
							buildJS();
						}
						setTimeout(function() {
							$building = false;
						}, 500);
					}
				});
				// Livereload
				var reloadServer = livereload.createServer();
				reloadServer.watch([$currentPath + '/project/js/', $currentPath + '/project/css/']);
			});
		}
		break;

	default:
		console.log('');
		console.log(chalkTitle('So what command do you want run?'));
		console.log('');
		console.log(chalkNumber('1)') + chalkCommand(' build'));
		console.log(chalkText('Build your project CSS and Javascript.'));
		console.log('');
		console.log(chalkNumber('2)') + chalkCommand(' build ') + chalkOption('<css|js|engine>'));
		console.log(chalkText('Build your project CSS or Javascript.'));
		console.log('');
		console.log(chalkNumber('3)') + chalkCommand(' create ') + chalkOption('<project_name> <version|tag|optional>'));
		console.log(chalkText('Create a new project with a fresh copy of Webplate and a starter index.html file.'));
		console.log('');
		console.log(chalkNumber('4)') + chalkCommand(' component add ') + chalkOption('<bower_component>'));
		console.log(chalkText('Install a new Bower component of your choice. Bower is really awesome!'));
		console.log('');
		console.log(chalkNumber('5)') + chalkCommand(' download ') + chalkOption('<version|tag|optional>'));
		console.log(chalkText('Download a crisp new copy of Webplate in the current directory.'));
		console.log('');
		console.log(chalkNumber('6)') + chalkCommand(' watch'));
		console.log(chalkText('Run the project watcher to watch for file changes. Any change will rebuild your CSS and Javascript and perform a live reload (if installed).'));
		console.log('');
		break;
}