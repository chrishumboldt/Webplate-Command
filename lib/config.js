/**
 * File: lib/config.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var fs = require('fs');
var path = require('path');
var web = require('webplate-tools');

var v = require('./variable');

module.exports = {
	read: function(callback) {
		if (v.dirName() === 'webplate') {
			var callback = (typeof callback === 'function') ? callback : false;
			fs.readFile(path.join(v.path.project.root, 'config.json'), function(error, data) {
				if (callback !== false) {
					var dataJSON = JSON.parse(data);
					callback(dataJSON);
				} else {
					return false;
				}
			});
		} else {
			if (callback !== false) {
				callback(false);
			} else {
				return false;
			}
		}
	},
	write: function(config, callback) {
		if (v.dirName() === 'webplate') {
			var callback = (typeof callback === 'function') ? callback : false;
			if (callback) {
				fs.writeFile(path.join(v.path.project.root, 'config.json'), JSON.stringify(config, null, '\t'), callback());
			} else {
				return false;
			}
		} else {
			if (callback !== false) {
				callback(false);
			} else {
				return false;
			}
		}
	}
};
