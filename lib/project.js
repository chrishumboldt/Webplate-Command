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
			config.read(function(config) {
				if (config !== false) {
					Web.log(colour.title('Building your project CSS...'));
					component.read(config, 'css', function(data) {
						if (data !== false) {
							var sass = data;

							// Project CSS
							if (config.build) {
								for (var i = 0, len = config.build.length; i < len; i++) {
									var build = config.build[i];
									var fileData = '';

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
										var data = fs.readFileSync(sass[i2]).toString();
										if (sass[i2] == path.join(v.path.engine.build.sass, 'import.scss')) {
											fileData += data.replace(new RegExp('@import "', 'g'), '@import "./engine/build/sass/');
										} else if (sass[i2].indexOf('.scss') > -1) {
											if (sass[i2].indexOf('component') > -1) {
												fileData += data.replace(new RegExp('@import "', 'g'), '@import "./project/component/');
											} else {
												fileData += data.replace(new RegExp('@import "', 'g'), '@import "./project/build/sass/');
											}
										} else {
											fileData += data;
										}
									}
									if (fileData.length > 0) {
										sassify.render({
											data: fileData,
											outputStyle: 'compressed'
										}, function(error, result) {
											if (error) {
												Web.log(colour.error(error.message));
											} else {
												var css = result.css.toString();
												fs.writeFile(path.join(v.path.project.css, build.name + '.min.css'), css, function(error) {
													if (error) {
														Web.log(colour.error(error));
													} else {
														Web.log(colour.command('CSS: ') + colour.action('project/css/' + build.name + '.min.css...') + colour.command('successful'));
													}
												});
											}
										});
									}
								}
							} else {
								Web.log(colour.command('CSS: ') + colour.action('Build config...') + colour.command('none'));
							}
						} else {
							message.webplate.build.none();
						}
					});
				} else {
					if (error === false) {
						error = true;
						message.webplate.dir.fail();
					}
				}
			});
		},
		// Javascript
		js: function() {
			config.read(function(config) {
				if (config !== false) {
					Web.log(colour.title('Building your project JS...'));
					component.read(config, 'js', function(data) {
						if (data !== false) {
							var js = [];
							for (var i = 0, len = data.length; i < len; i++) {
								js.push(data[i]);
							}
							if (config.build) {
								for (var i = 0, len = config.build.length; i < len; i++) {
									var build = config.build[i];
									if (build.js) {
										for (var i2 = 0, len2 = build.js.length; i2 < len2; i2++) {
											var includeFile = path.join(v.path.project.build.js, build.js[i2]);
											var includeFileExt = Web.getExtension(includeFile);
											if (includeFileExt === 'js') {
												if (js.indexOf(includeFile) == -1) {
													js.push(includeFile);
												}
											}
										}
										if (js.length > 0) {
											var projectJS = uglify.minify(js, v.options.uglify);
											fs.writeFile(path.join(v.path.project.js, build.name + '.min.js'), projectJS.code, function(error) {
												if (error) {
													console.log(colour.error(error));
												} else {
													console.log(colour.command('JS: ') + colour.action('project/js/' + build.name + '.min.js...') + colour.command('successful'));
												}
											});
										}
									}
								}
							} else {
								Web.log(colour.command('JS: ') + colour.action('Build config...') + colour.command('none'));
							}
						} else {
							message.webplate.build.none();
						}
					});
				} else {
					if (error === false) {
						error = true;
						message.webplate.dir.fail();
					}
				}
			});
		}
	}
};
