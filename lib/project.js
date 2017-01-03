/**
 * File: lib/project.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var build = require('./build');
var colour = require('./colour');
var Rocket = require('rocket-tools');

var v = require('./variable');

// Variables
var error = false;

// Execute
module.exports = {
	build: {
		all: function () {
			Rocket.log(colour.title('Building your project...'));
			build.all(false);
		},
		css: function () {
			build.css();
		},
		js: function () {
			build.js();
		}
	}
};
