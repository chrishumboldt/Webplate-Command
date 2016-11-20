/**
 * File: lib/watch.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var build = require('./build');
var chokidar = require('chokidar');
var colour = require('./colour');
var engine = require('./engine');
var livereload = require('livereload');
var message = require('./message');
var Rocket = require('rocket-tools');

// Variables
var v = require('./variable');

// Execute
module.exports = {
	build: function () {
		var building = false;

		message.rocket.watch.build();
		this.reload();

		// Build watcher
		var watcher = chokidar.watch(v.watch, {
			ignored: /^\./,
			persistent: true
		});
		watcher.on('change', function(path) {
			if (building === false) {
				message.rocket.watch.change(path);
				var fileExt = Rocket.get.extension(path);

				building = true;
				setTimeout(function() {
					building = false;
				}, 1000);

				switch (fileExt) {
					case 'scss':
						build.css();
						break;
					case 'js':
						build.js();
						break;
					case 'json':
						build.all();
				}
			}
		});
	},
	reload: function () {
		var reloadServer = livereload.createServer();
		reloadServer.watch(v.reload);
	},
	passive: function() {
		message.rocket.watch.passive();
		this.reload();
	}
};
