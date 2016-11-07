/**
 * File: lib/message.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var Rocket = require('rocket-tools');

module.exports = {
	rocket: {
		build: {
			none: function() {
				Rocket.log('');
				Rocket.log(colour.warning('Warning: ') + colour.action('Build config...') + colour.command('none'));
				Rocket.log('');
			}
		},
		dir: {
			fail: function() {
				Rocket.log('');
				Rocket.log(colour.warningBold('Warning:') + colour.warning(' You do not appear to be in a rocket directory.'));
				Rocket.log(colour.action('All project and engine related commands need to be run from within it.'));
				Rocket.log('');
			}
		}
	}
};
