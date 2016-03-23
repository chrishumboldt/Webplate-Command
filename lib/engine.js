/**
 * File: lib/engine.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

// Requires
var colour = require('./log-colour');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var sass = require('node-sass');
var uglify = require('uglify-js');
var web = require('webplate-tools');

var $v = require('./variable');

// Execute
module.exports = {
	build: {
		all: function() {
			if ($v.dirName() === 'webplate') {
				console.log(colour.title('Rebuilding the engine...'));
				this.css();
				this.scripts();
				this.start();
				this.touch();
			} else {
				message.webplate.dir.fail();
			}
		},
		css: function() {
			// Engine CSS
			sass.render({
				file: $v.engine.sass,
				outputStyle: 'compressed'
			}, function($error, $result) {
				if ($error) {
					console.log(colour.error($error.message));
				} else {
					var $css = $result.css.toString();
					fs.writeFile(path.join($v.path.engine.css, 'styles.min.css'), $css, function($error) {
						if ($error) {
							console.log(colour.error($error));
						} else {
							console.log(colour.command('CSS: ') + colour.action('engine/styles.min.css...') + colour.command('successful'));
						}
					});
				}
			});
		},
		scripts: function() {
			// Engine scripts
			var $engineScriptJS = uglify.minify($v.engine.scripts, $v.options.uglify);
			fs.writeFile(path.join($v.path.engine.js, 'scripts.min.js'), $engineScriptJS.code, function($error) {
				if ($error) {
					console.log(colour.error($error));
				} else {
					console.log(colour.command('JS: ') + colour.action('engine/scripts.min.js...') + colour.command('successful'));
				}
			});
		},
		start: function() {
			// Engine start
			var $engineStartJS = uglify.minify($v.engine.start, $v.options.uglify);
			fs.writeFile(path.join('start.js'), $engineStartJS.code, function($error) {
				if ($error) {
					console.log(colour.error($error));
				} else {
					console.log(colour.command('JS: ') + colour.action('start.js...') + colour.command('successful'));
				}
			});
		},
		touch: function() {
			// Engine touch
			var $engineTouchJS = uglify.minify($v.engine.touch, $v.options.uglify);
			fs.writeFile(path.join($v.path.engine.js, 'touch.min.js'), $engineTouchJS.code, function($error) {
				if ($error) {
					console.log(colour.error($error));
				} else {
					console.log(colour.command('JS: ') + colour.action('engine/touch.min.js...') + colour.command('successful'));
				}
			});
		}
	}
};