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
var web = require('webplate-tools');

var v = require('./variable');

// Execute
module.exports = {
	build: {
		all: function() {
			if (v.dirName() === 'webplate') {
				web.log(colour.title('Rebuilding the engine...'));
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
			sassify.render({
				file: v.engine.sass,
				outputStyle: 'compressed'
			}, function(error, result) {
				if (error) {
					web.log(colour.error(error.message));
				} else {
					var css = result.css.toString();
					fs.writeFile(path.join(v.path.engine.css, 'styles.min.css'), css, function(error) {
						if (error) {
							web.log(colour.error(error));
						} else {
							web.log(colour.command('CSS: ') + colour.action('engine/css/styles.min.css...') + colour.command('successful'));
						}
					});
				}
			});
		},
		scripts: function() {
			// Engine scripts
			var engineScriptJS = uglify.minify(v.engine.scripts, v.options.uglify);
			fs.writeFile(path.join(v.path.engine.js, 'scripts.min.js'), engineScriptJS.code, function(error) {
				if (error) {
					web.log(colour.error(error));
				} else {
					web.log(colour.command('JS: ') + colour.action(path.join(v.path.engine.js, 'scripts.min.js...')) + colour.command('successful'));
				}
			});
		},
		start: function() {
			// Engine start
			var engineStartJS = uglify.minify(v.engine.start, v.options.uglify);
			fs.writeFile(path.join('start.js'), engineStartJS.code, function(error) {
				if (error) {
					web.log(colour.error(error));
				} else {
					web.log(colour.command('JS: ') + colour.action('start.js...') + colour.command('successful'));
				}
			});
		},
		touch: function() {
			// Engine touch
			var engineTouchJS = uglify.minify(v.engine.touch, v.options.uglify);
			fs.writeFile(path.join(v.path.engine.js, 'touch.min.js'), engineTouchJS.code, function(error) {
				if (error) {
					web.log(colour.error(error));
				} else {
					web.log(colour.command('JS: ') + colour.action(path.join(v.path.engine.js, 'touch.min.js....')) + colour.command('successful'));
				}
			});
		}
	}
};
