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
function createMessageSingleBottom (messages) {
	Rocket.log('');
	for (var i = 0, len = messages.length; i < len; i++) {
		Rocket.log(messages[i]);
	}
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
				createMessageSingleBottom([
					colour.title('Rebuilding the engine...')
				]);
			},
			exists: function() {
				createMessage([
					colour.warning('Warning: ') + colour.action('There already appears to be a build directory...')
				]);
			},
			noCockpit: function () {
				createMessage([
					colour.command('File: ') + colour.action('cockpit.json...') + colour.command('not found')
				]);
			},
			none: function() {
				createMessage([
					colour.warning('Warning: ') + colour.action('Build config...') + colour.command('none')
				]);
			},
			noneSmall: function() {
				createMessageNone([
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
         created: function (name) {
				createMessageNone([
					colour.command('Create Directory: ') + colour.action(name + '...') + colour.command('successful')
				]);
			},
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
				createMessageNone([
					colour.command('Directory: ') + colour.action(name + '...') + colour.command('not found')
				]);
			}
		},
		project: {
			create: function () {
				createMessage([
					colour.title('Creating a new Rocket project...')
				]);
			}
		},
		watch: {
			build: function () {
				createMessageSingleBottom([
					colour.title('Watching your SCSS, CSS, JS and cockpit.json...')
				]);
			},
			change: function (path) {
				createMessageSingleBottom([
					colour.command('File: ') + colour.action(path) + colour.command('...updated')
				]);
			},
         error: error => {
            createMessageSingleBottom([
					colour.error('Error: ') + colour.action(error)
				]);
         },
			passive: function () {
				createMessage([
					colour.title('Watching your CSS and JS...')
				]);
			}
		}
	}
};
