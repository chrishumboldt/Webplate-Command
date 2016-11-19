/**
 * File: lib/rc-module.js
 * Type: Javascript Node module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var fs = require('fs');
var message = require('./message');
var Rocket = require('rocket-tools');
var shell = require('shelljs');

var v = require('./variable');

module.exports = {
   add: function (thisModule) {
      // Catch
      if (v.dirName() !== 'rocket') {
         message.rocket.dir.fail();
      }
      // Continue
      message.rocket.rcModule.download();
		var child = shell.exec('npm install ' + thisModule, {
			async: true
		});
		// Output
		child.stdout.on('data', function(data) {
			Rocket.log(data.trim());
		});
		child.stderr.on('data', function(data) {
			Rocket.log('Error: ' + colour.error(data));
		});
		child.on('close', function() {
         message.rocket.rcModule.added(thisModule);
		});
   },
   remove: function(thisModule) {
		message.rocket.rcModule.remove();
		var child = shell.exec('npm uninstall ' + thisModule, {
			async: true
		});
		// Output
		child.stdout.on('data', function(data) {
			Rocket.log(data.trim());
		});
		child.stderr.on('data', function(data) {
			Rocket.log('Error: ' + colour.error(data));
		});
		child.on('close', function(code) {
         message.rocket.rcModule.removed(thisModule);
		});
	}
};
