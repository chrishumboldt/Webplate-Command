/**
 * File: lib/message.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var Web = require('webplate-tools');

module.exports = {
	webplate: {
		build: {
			none: function() {
				Web.log('');
				Web.log(colour.warning('Warning: ') + colour.action('Build config...') + colour.command('none'));
				Web.log('');
			}
		},
		dir: {
			fail: function() {
				Web.log('');
				Web.log(colour.warningBold('Warning:') + colour.warning(' You do not appear to be in a webplate directory.'));
				Web.log(colour.action('All project and engine related commands need to be run from within it.'));
				Web.log('');
			}
		}
	}
};
