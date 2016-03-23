/**
 * File: lib/config.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

var fs = require('fs');
var path = require('path');
var web = require('webplate-tools');

var $v = require('./variable');

module.exports = {
	read: function($callback) {
		if ($v.dirName() === 'webplate') {
			var $callback = (typeof $callback !== 'undefined') ? $callback : false;

			fs.readFile(path.join($v.path.project.root, 'config.json'), function($error, $data) {
				if ($callback !== false) {
					var $dataJSON = JSON.parse($data);
					$callback($dataJSON);
				} else {
					return false;
				}
			});
		} else {
			if ($callback !== false) {
				$callback(false);
			} else {
				return false;
			}
		}
	}
};