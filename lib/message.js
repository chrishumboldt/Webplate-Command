/**
 * File: lib/message.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

var colour = require('./log-colour');
var web = require('webplate-tools');

module.exports = {
	webplate: {
		build: {
			none: function() {
				console.log(colour.action('Build config...') + colour.command('none'));
			}
		},
		dir: {
			fail: function() {
				web.log('');
				web.log(colour.warningBold('Warning:') + colour.warning(' You do not appear to be in a webplate directory.'));
				web.log(colour.action('All project and engine related commands need to be run from within it.'));
				web.log('');
			}
		}
	}
};