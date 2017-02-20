/**
 * File: lib/watch.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
const build = require('./build');
const cockpit = require('./cockpit');
const chokidar = require('chokidar');
const colour = require('./colour');
const engine = require('./engine');
const livereload = require('livereload');
const message = require('./message');
const path = require('path');
const Rocket = require('rocket-tools');

// Variables
const v = require('./variable');

// Execute
module.exports = {
	build: function () {
		let building = false;

		message.rocket.watch.build();
		this.reload();

		// Build watcher
      cockpit.read(json => {
         let buildRoot = 'build';
         let watchPath = [
            path.join('cockpit.json')
         ]
         if (Rocket.is.json(json) && Rocket.is.string(json.buildRoot)) {
            buildRoot = json.buildRoot;
         }
         watchPath.push(path.join(buildRoot, 'css'));
         watchPath.push(path.join(buildRoot, 'js'));
         watchPath.push(path.join(buildRoot, 'sass'));

   		let watcher = chokidar.watch(watchPath, {
   			ignored: /^\./,
   			persistent: true
   		});

         // Events
   		watcher
         .on('change', path => {
   			if (building === false) {
   				message.rocket.watch.change(path);
   				let fileExt = Rocket.get.extension(path);

   				building = true;
   				setTimeout(() => {
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
   		})
         .on('error', error => {
            message.rocket.watch.error(error);
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
