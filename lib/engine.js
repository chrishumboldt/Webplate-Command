/**
 * File: lib/engine.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var colour = require('./colour');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var sassify = require('node-sass');
var uglify = require('uglify-js');
var Web = require('rocket-tools');

var v = require('./variable');

// Execute
module.exports = {
	build: {
		all: function() {
			if (v.dirName() === 'webplate') {
				Web.log(colour.title('Rebuilding the engine...'));
				this.css();
				this.scripts();
				this.start();
				this.touch();
			} else {
				message.webplate.dir.fail();
			}
		},
		css: function() {
			// Engine styles
			sassify.render({
				file: v.engine.sass.main,
				outputStyle: 'compressed'
			}, function(error, result) {
				if (error) {
					Web.log(colour.error(error.message));
				} else {
					var css = result.css.toString();
					fs.writeFile(path.join(v.path.engine.css, 'styles.min.css'), css, function(error) {
						if (error) {
							Web.log(colour.error(error));
						} else {
							Web.log(colour.command('CSS: ') + colour.action('engine/css/styles.min.css...') + colour.command('successful'));
						}
					});
				}
			});
			// Engine styles light (without components)
			sassify.render({
				file: v.engine.sass.mainLight,
				outputStyle: 'compressed'
			}, function(error, result) {
				if (error) {
					Web.log(colour.error(error.message));
				} else {
					var css = result.css.toString();
					fs.writeFile(path.join(v.path.engine.css, 'styles-light.min.css'), css, function(error) {
						if (error) {
							Web.log(colour.error(error));
						} else {
							Web.log(colour.command('CSS: ') + colour.action('engine/css/styles-light.min.css...') + colour.command('successful'));
						}
					});
				}
			});
		},
		scripts: function() {
			// Engine scripts
			var engineJS = uglify.minify(v.engine.main.concat(v.engine.components), v.options.uglify);
			fs.writeFile(path.join(v.path.engine.js, 'scripts.min.js'), engineJS.code, function(error) {
				if (error) {
					Web.log(colour.error(error));
				} else {
					Web.log(colour.command('JS: ') + colour.action(path.join(v.path.engine.js, 'scripts.min.js...')) + colour.command('successful'));
				}
			});
			// Engine scripts light (without components)
			var engineJSLight = uglify.minify(v.engine.main, v.options.uglify);
			fs.writeFile(path.join(v.path.engine.js, 'scripts-light.min.js'), engineJSLight.code, function(error) {
				if (error) {
					Web.log(colour.error(error));
				} else {
					Web.log(colour.command('JS: ') + colour.action(path.join(v.path.engine.js, 'scripts-light.min.js...')) + colour.command('successful'));
				}
			});
		},
		start: function() {
			// Engine start
			var engineStartJS = uglify.minify(v.engine.start, v.options.uglify);
			fs.writeFile(path.join('start.js'), engineStartJS.code, function(error) {
				if (error) {
					Web.log(colour.error(error));
				} else {
					Web.log(colour.command('JS: ') + colour.action('start.js...') + colour.command('successful'));
				}
			});
		},
		touch: function() {
			// Engine touch
			var engineTouchJS = uglify.minify(v.engine.touch, v.options.uglify);
			fs.writeFile(path.join(v.path.engine.js, 'touch.min.js'), engineTouchJS.code, function(error) {
				if (error) {
					Web.log(colour.error(error));
				} else {
					Web.log(colour.command('JS: ') + colour.action(path.join(v.path.engine.js, 'touch.min.js....')) + colour.command('successful'));
				}
			});
		}
	}
};
