/**
 * File: lib/message.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var colour = require('./colour');
var Rocket = require('rocket-tools');

// functions
function createMessage (messages) {
	Rocket.log('');
	for (var i = 0, len = messages.length; i < len; i++) {
		Rocket.log(messages[i]);
	}
	Rocket.log('');
};
function createMessageNone (messages) {
	for (var i = 0, len = messages.length; i < len; i++) {
		Rocket.log(messages[i]);
	}
};
function createMessageSingle (messages) {
	for (var i = 0, len = messages.length; i < len; i++) {
		Rocket.log(messages[i]);
	}
	Rocket.log('');
};

// Exports
module.exports = {
	rocket: {
		build: {
			all: function () {
				createMessage([
					colour.title('Building started...')
				]);
			},
			engine: function () {
				createMessage([
					colour.title('Rebuilding the engine...')
				]);
			},
			exists: function() {
				createMessage([
					colour.warning('Warning: ') + colour.action('There already appears to be a build directory...')
				]);
			},
			none: function() {
				createMessage([
					colour.warning('Warning: ') + colour.action('Build config...') + colour.command('none')
				]);
			}
		},
		cache: {
			created: function () {
				createMessageNone([
					colour.command('Cache: ') + colour.action('Timestamp add...') + colour.command('successful')
				]);
			},
			noProperty: function () {
				createMessageNone([
					colour.warning('Warning: ') + colour.action('Cache property in cockpit.json...') + colour.command('not found')
				]);
			},
			removed: function () {
				createMessageNone([
					colour.command('Cache: ') + colour.action('Busting property removed...') + colour.command('successful')
				]);
			},
			removing: function () {
				createMessage([
					colour.title('Removing the cache busting property from the Rockt cockpit.json file...')
				]);
			},
			starting: function () {
				createMessage([
					colour.title('Cache busting in progress...')
				]);
			},
			updated: function () {
				createMessageNone([
					colour.command('Cache: ') + colour.action('Timestamp update...') + colour.command('successful')
				]);
			}
		},
		create: {
			build: function () {
				createMessage([
					colour.title('Creating a build instance...')
				]);
			}
		},
		dir: {
			fail: function() {
				createMessage([
					colour.warningBold('Warning:') + colour.action(' You do not appear to be in a rocket directory.'),
					colour.text('All project and engine related commands need to be run from within it.')
				]);
			},
			noBuild: function() {
				createMessage([
					colour.warningBold('Warning:') + colour.action(' No build directory found.')
				]);
			},
			none: function (name) {
				createMessage([
					colour.command('Directory: ') + colour.action(name + '...') + colour.command('not found')
				]);
			}
		},
		rcModule: {
			added: function (thisModule) {
				createMessage([
					colour.command('Module: ') + colour.action(thisModule) + colour.title(' has been added. Woohoo!'),
					colour.text('You can view it under the node_modules directory.')
				]);
			},
			download: function () {
				createMessage([
					colour.title('Downloading the package...')
				]);
			},
			remove: function (thisModule) {
				createMessage([
					colour.title('Removing the package...')
				]);
			},
			removed: function (thisModule) {
				createMessage([
					colour.command('Module: ') + colour.action(thisModule) + colour.title(' has been removed. Ahhhhhhhh.')
				]);
			}
		}
	}
};
