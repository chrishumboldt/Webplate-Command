/**
 * File: lib/watch.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var build = require('./build');
var cockpit = require('./cockpit');
var chokidar = require('chokidar');
var colour = require('./colour');
var engine = require('./engine');
var livereload = require('livereload');
var message = require('./message');
var path = require('path');
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
      cockpit.read(function (json) {
         var buildRoot = 'build';
         var watchPath = [
            path.join('cockpit.json')
         ]
         if (Rocket.is.json(json) && Rocket.is.string(json.buildRoot)) {
            buildRoot = json.buildRoot;
         }
         watchPath.push(path.join(buildRoot, 'css'));
         watchPath.push(path.join(buildRoot, 'js'));
         watchPath.push(path.join(buildRoot, 'sass'));

   		var watcher = chokidar.watch(watchPath, {
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
                  case 'css':
   						build.init('css');
   						break;
   					case 'js':
   						build.init('js');
   						break;
   					default:
   						build.init('all');
   				}
   			}
   		});
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
