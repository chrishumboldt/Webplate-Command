/**
 * Author: Chris Humboldt
**/

// Requires
var build = require('./build');
var colour = require('./colour');
var message = require('./message');
var Rocket = require('rocket-tools');
var shell = require('shelljs');

var v = require('./variable');

// Execute
module.exports = {
	build: {
		all: function() {
			if (v.dirName() === 'rocket') {
				message.rocket.build.engine();
				shell.cd('engine');
				build.init('all');
			} else {
				message.rocket.dir.fail();
			}
		}
	}
};
