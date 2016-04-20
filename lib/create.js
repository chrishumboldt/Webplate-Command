/**
 * File: lib/create.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

var colour = require('./log-colour');
var download = require('./download');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var web = require('webplate-tools');

var $v = require('./variable');

module.exports = {
	component: function() {
		web.log('Creating component');
	},
	project: function($name, $version) {
		// Variables
		var $self = this;

		// Functions
		var projectComplete = function() {
			web.log(colour.text('Your project has been created. Build something out of this world!'));
		};

		// Execute
		if ($name != undefined) {
			web.log(colour.title('Creating a new Webplate project...'));

			shell.mkdir('-p', $name);
			shell.cd(path.join($name));

			fs.writeFile('index.html', $v.html.index, function($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					web.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
					download.webplate($version, projectComplete);
				}
			});
		} else {
			web.log(colour.error('No project name provided.'));
		}
	}
};
