/*
Author: Chris Humboldt
*/

'use strict';

const build = require('./build');
const colour = require('./colour');
const message = require('./message');
const Rocket = require('rocket-tools');
const shell = require('shelljs');

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
