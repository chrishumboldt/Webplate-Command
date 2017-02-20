/*
Author: Chris Humboldt
*/

'use strict';

const colour = require('./colour');
const fs = require('fs');
const message = require('./message');
const path = require('path');
const Rocket = require('rocket-tools');

var v = require('./variable');

module.exports = {
	read: function(callback) {
		// Catch
		if (!Rocket.is.function(callback)) {
			return false;
		}
		// Continue
		fs.readFile(path.join('cockpit.json'), function(error, data) {
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
