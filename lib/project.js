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
var Rocket = require('rocket-tools');
var sassify = require('node-sass');
var uglify = require('uglify-js');

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
						message.rocket.dir.fail();
					}
				}
				// Build
				self.getBuilds(config, function (data) {
					// Catch
					if (!data.has.sass) {
						return false;
					}
					// Create CSS
					Rocket.log(colour.title('Building your project CSS...'));
					for (var key in data.builds) {
						if (data.builds.hasOwnProperty(key) && typeof data.builds[key].sass === 'object') {
							var thisBuild = data.builds[key];
							var fileData = '';
							for (var i = 0, len = thisBuild.sass.length; i < len; i++) {
								var thisExtension = Rocket.get.extension(thisBuild.sass[i]);
								if (thisExtension === 'scss') {
								   fileData += '@import "' + thisBuild.sass[i] + '";';
								} else if (thisExtension === 'css') {
									fileData += fs.readFileSync(thisBuild.sass[i]);
								}
							}
							self.cssExecute(fileData, key);
						}
					}
				});
			});
		},
		cssExecute: function (fileData, name) {
			if (fileData.length > 0) {
				sassify.render({
					data: fileData,
					outputStyle: 'compressed'
				}, function(error, result) {
					if (error) {
						Rocket.log(colour.error(error.message));
						Rocket.log('');
						Rocket.log(colour.warning('Warning: ') + colour.text('Possible dependency issue.'));
						Rocket.log(colour.name('Note: ') + colour.text('Make sure all development dependencies have been install for your project components.'));
						Rocket.log(colour.name('Note: ') + colour.text('You can do this by navigating to the component and running ') + colour.action('bower install') + colour.text('.'));
						Rocket.log('');
					} else {
						var css = result.css.toString();
						fs.writeFile(path.join(v.path.project.css, name + '.min.css'), css, function(error) {
							if (error) {
								Rocket.log(colour.error(error));
							} else {
								Rocket.log(colour.command('CSS: ') + colour.action('project/css/' + name + '.min.css...') + colour.command('successful'));
							}
						});
					}
				});
			}
		},
		// Get builds
		getBuilds: function(config, callback) {
			// Variables
			var callback = (typeof callback === 'function') ? callback : false;
			var returnObj = {
				has: {
					js: false,
					sass: false
				},
				builds: {}
			};

			// Catch
			if (typeof config !== 'object' || !config.build) {
				if (!error) {
					error = true;
					message.rocket.build.none();
				}
				if (callback) {
					return callback(returnObj);
				}
				return returnObj;
			}

			// Functions
			var addFileToReturn = function (buildName, includeFile) {
				var includeFileExt = Rocket.get.extension(includeFile);
				if ((includeFileExt === 'css' || includeFileExt === 'scss') && returnObj.builds[buildName].sass.indexOf(includeFile) < 0) {
					returnObj.builds[buildName].sass.push(includeFile);
					returnObj.has.sass = true;
				} else if (includeFileExt === 'js' && returnObj.builds[buildName].js.indexOf(includeFile) < 0) {
					returnObj.builds[buildName].js.push(includeFile);
					returnObj.has.js = true;
				}
			};

			// Execute
			for (var i = 0, len = config.build.length; i < len; i++) {
				// Catch
				if (!config.build[i].name) {
					return false;
				}
				// Continue
			   var thisBuild = config.build[i];
				// Set the name
				// This includes the default Rocket import SASS file.
				returnObj.builds[thisBuild.name] = {
					sass: [v.engine.sass.import],
					js: []
				};
				// Components
				if (typeof thisBuild.component === 'object') {
					for (var i2 = 0, len2 = thisBuild.component.length; i2 < len2; i2++) {
					   var data = JSON.parse(fs.readFileSync(path.join(v.path.component, thisBuild.component[i2], 'package.json')));
						// Catch
						if (typeof data.rocket !== 'object' || typeof data.rocket.build === 'undefined') {
							return false;
						}
						// Continue
						if (typeof data.rocket.build == 'object') {
							for (var i3 = 0, len3 = data.rocket.build.length; i3 < len3; i3++) {
								addFileToReturn(thisBuild.name, path.join(v.path.component, data.name, data.rocket.build[i3]));
							}
						} else if (typeof data.rocket.build === 'string') {
							addFileToReturn(thisBuild.name, path.join(v.path.component, data.name, data.rocket.build));
						}
					}
				}
				// SASS
				if (typeof thisBuild.sass === 'object') {
					for (var i2 = 0, len2 = thisBuild.sass.length; i2 < len2; i2++) {
					   addFileToReturn(thisBuild.name, path.join(v.path.project.build.sass, thisBuild.sass[i2]));
					}
				}
				// JS
				if (typeof thisBuild.js === 'object') {
					for (var i2 = 0, len2 = thisBuild.js.length; i2 < len2; i2++) {
					   addFileToReturn(thisBuild.name, path.join(v.path.project.build.js, thisBuild.js[i2]));
					}
				}
			}

			// Return
			if (typeof callback === 'function') {
				return callback(returnObj);
			}
			return returnObj;
		},
		// Javascript
		js: function() {
			var self = this;
			config.read(function(config) {
				// Catch
				if (!config) {
					if (!error) {
						error = true;
						message.rocket.dir.fail();
					}
				}
				// Build
				self.getBuilds(config, function (data) {
					// Catch
					if (!data.has.js) {
						return false;
					}
					// Create JS
					Rocket.log(colour.title('Building your project JS...'));
					for (var key in data.builds) {
						if (data.builds.hasOwnProperty(key) && typeof data.builds[key].js === 'object') {
							self.jsExecute(data.builds[key].js, key);
						}
					}
				});
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
