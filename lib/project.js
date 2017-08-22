/*
Author: Chris Humboldt
*/

'use strict';

const build = require('./build');
const colour = require('./colour');
const Rocket = require('rocket-tools');

const v = require('./variable');

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
