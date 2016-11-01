/**
 * File: lib/project.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var colour = require('./colour');
var component = require('./component');
var config = require('./config');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var sassify = require('node-sass');
var uglify = require('uglify-js');
var Web = require('webplate-tools');

var v = require('./variable');

// Variables
var error = false;

// Execute
module.exports = {
	build: {
		// All
		all: function() {
			this.css();
			this.js();
		},
		// Styles
		css: function() {
			var self = this;
			config.read(function(config) {
				// Catch
				if (!config) {
					if (!error) {
						error = true;
						message.webplate.dir.fail();
					}
				}
				// Build
				Web.log(colour.title('Building your project CSS...'));
				self.getBuilds(config, 'all', function (data) {
					console.log(data);
				});

				/*
				if (data !== false) {
					// Project CSS
					if (config.build) {
						for (var i = 0, len = config.build.length; i < len; i++) {
							var build = config.build[i];
							var fileData = '';
							var sass = data;

							// SASS
							if (build.sass) {
								for (var i2 = 0, len2 = build.sass.length; i2 < len2; i2++) {
									var includeFile = path.join(v.path.project.build.sass, build.sass[i2]);
									var includeFileExt = Web.getExtension(includeFile);
									if ((includeFileExt === 'css' || includeFileExt === 'scss') && sass.indexOf(includeFile) == -1) {
										sass.push(includeFile);
									}
								}
							}
							for (var i2 = 0, len2 = sass.length; i2 < len2; i2++) {
								fileData += '@import "' + sass[i2] + '";';
							}
							self.cssExecute(fileData, build.name);
						}
					} else {
						Web.log(colour.command('CSS: ') + colour.action('Build config...') + colour.command('none'));
					}
				} else {
					message.webplate.build.none();
				}
				*/
			});
		},
		cssExecute: function (fileData, name) {
			if (fileData.length > 0) {
				sassify.render({
					data: fileData,
					outputStyle: 'compressed'
				}, function(error, result) {
					if (error) {
						Web.log(colour.error(error.message));
						Web.log('');
						Web.log(colour.warning('Warning: ') + colour.text('Possible dependency issue.'));
						Web.log(colour.name('Note: ') + colour.text('Make sure all development dependencies have been install for your project components.'));
						Web.log(colour.name('Note: ') + colour.text('You can do this by navigating to the component and running ') + colour.action('bower install') + colour.text('.'));
						Web.log('');
					} else {
						var css = result.css.toString();
						fs.writeFile(path.join(v.path.project.css, name + '.min.css'), css, function(error) {
							if (error) {
								Web.log(colour.error(error));
							} else {
								Web.log(colour.command('CSS: ') + colour.action('project/css/' + name + '.min.css...') + colour.command('successful'));
							}
						});
					}
				});
			}
		},
		// Get builds
		getBuilds: function(config, type, callback) {
			// Variables
			var callback = (typeof callback === 'function') ? callback : false;
			var type = (typeof type === 'string' && (type === 'css' || type === 'js')) ? type : 'all';
			var returnObj = {};

			// Catch
			if (typeof config !== 'object' || !config.build) {
				if (!callback) {
					return false;
				}
				return callback(false);
			}

			// Functions

			// Execute
			for (var i = 0, len = config.build.length; i < len; i++) {
				// Catch
				if (!config.build[i].name) {
					return false;
				}
				// Continue
			   var thisBuild = config.build[i];
				// Set the name
				returnObj[thisBuild.name] = {
					sass: [v.engine.sass.import],
					js: []
				};
				// Components
				if (thisBuild.components) {
					for (var i2 = 0, len2 = thisBuild.components.length; i2 < len2; i2++) {
					   var data = fs.readFileSync(path.join(v.path.project.component, thisBuild.components[i2], '.bower.json'));
						var bower = JSON.parse(data);
						if (typeof bower.main == 'object') {
							for (var i3 = 0, len3 = bower.main.length; i3 < len3; i3++) {
								var includeFile = path.join(v.path.project.component, bower.name, bower.main[i3]);
								var includeFileExt = Web.getExtension(includeFile);
								if ((includeFileExt === 'css' || includeFileExt === 'scss') && returnObj[thisBuild.name].sass.indexOf(includeFile) < 0) {
									returnObj[thisBuild.name].sass.push(includeFile);
								} else if (includeFileExt === 'js' && returnObj[thisBuild.name].js.indexOf(includeFile) < 0) {
									returnObj[thisBuild.name].js.push(includeFile);
								}
							}
						} else if (typeof bower.man === 'string') {
							var includeFile = path.join(v.path.project.component, bower.name, bower.main);
							var includeFileExt = Web.getExtension(includeFile);
							if ((includeFileExt === 'css' || includeFileExt === 'scss') && returnObj[thisBuild.name].sass.indexOf(includeFile) < 0) {
								returnObj[thisBuild.name].sass.push(includeFile);
							} else if (includeFileExt === 'js' && returnObj[thisBuild.name].js.indexOf(includeFile) < 0) {
								returnObj[thisBuild.name].js.push(includeFile);
							}
						}
					}
				}
				// SASS
				if (typeof thisBuild.sass === 'object') {
					for (var i2 = 0, len2 = thisBuild.sass.length; i2 < len2; i2++) {
					   if (Web.getExtension(thisBuild.sass[i2]) === 'scss') {

						}
					}
				}
			}
			console.log(JSON.stringify(returnObj, null, '  '));

			/*
			var callback = (typeof callback !== 'undefined') ? callback : false;
			var type = type || 'all';
			var project = {
				sass: [path.join('engine', 'build', 'sass', '_import.scss')],
				js: []
			};

			// Read the component files
			for (var i = 0, len = config.build.length; i < len; i++) {
				var build = config.build[i];
				if (build.components) {
					for (var i2 = 0, len2 = build.components.length; i2 < len2; i2++) {
						try {
							var data = fs.readFileSync(path.join(v.path.project.component, build.components[i2], '.bower.json'));
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
			*/
		},
		// Javascript
		js: function() {
			var self = this;
			config.read(function(config) {
				// if (config !== false) {
				// 	Web.log(colour.title('Building your project JS...'));
				// 	component.read(config, 'js', function(data) {
				// 		if (data !== false) {
				// 			if (config.build) {
				// 				for (var i = 0, len = config.build.length; i < len; i++) {
				// 					var build = config.build[i];
				// 					var js = data;
				//
				// 					if (build.js) {
				// 						for (var i2 = 0, len2 = build.js.length; i2 < len2; i2++) {
				// 							var includeFile = path.join(v.path.project.build.js, build.js[i2]);
				// 							var includeFileExt = Web.getExtension(includeFile);
				// 							if (includeFileExt === 'js') {
				// 								if (js.indexOf(includeFile) == -1) {
				// 									js.push(includeFile);
				// 								}
				// 							}
				// 						}
				// 					}
				// 					self.jsExecute(js, build.name);
				// 				}
				// 			} else {
				// 				Web.log(colour.command('JS: ') + colour.action('Build config...') + colour.command('none'));
				// 			}
				// 		} else {
				// 			message.webplate.build.none();
				// 		}
				// 	});
				// } else {
				// 	if (error === false) {
				// 		error = true;
				// 		message.webplate.dir.fail();
				// 	}
				// }
			});
		},
		jsExecute: function (js, name) {
			if (js.length > 0) {
				var projectJS = uglify.minify(js, v.options.uglify);
				fs.writeFile(path.join(v.path.project.js, name + '.min.js'), projectJS.code, function(error) {
					if (error) {
						console.log(colour.error(error));
					} else {
						console.log(colour.command('JS: ') + colour.action('project/js/' + name + '.min.js...') + colour.command('successful'));
					}
				});
			}
		}
	}
};
