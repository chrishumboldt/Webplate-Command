/**
 * File: lib/cockpit.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var Rocket = require('rocket-tools');

var v = require('./variable');

module.exports = {
	read: function(configPath, callback) {
		// Catch
		if (!Rocket.is.function(callback)) {
			return false;
		}
		// Continue
		var configPath = (Rocket.is.string(configPath)) ? configPath : path.join('cockpit.json');
		fs.readFile(configPath, function(error, data) {
			// Catch
			if (error) {
				message.rocket.build.noCockpit();
				return callback(false);
			}
			// Continue
			return callback(JSON.parse(data));
		});
	},
	write: function(configPath, data, callback) {
		// Catch
		if (!Rocket.is.function(callback)) {
			return false;
		}
		// Continue
		var configPath = (Rocket.is.string(configPath)) ? configPath : path.join('cockpit.json');
		fs.writeFile(configPath, JSON.stringify(data, null, '\t'), callback());
	}
};
