/**
 * File: lib/create.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

var colour = require('./colour');
var download = require('./download');
var fs = require('fs');
var generate = require('./generate');
var path = require('path');
var shell = require('shelljs');
var web = require('webplate-tools');

var $v = require('./variable');

module.exports = {
	component: function($name) {
		// Execute
		if ($name != undefined) {
			web.log(colour.title('Creating a new Webplate component...'));

			shell.mkdir('-p', $name);
			shell.cd(path.join($name));
			web.log(colour.command('Folder: ') + colour.action($name + '...') + colour.command('created'));

			// Create files
			fs.writeFile('README.md', generate.readme($name), function($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					web.log(colour.command('File: ') + colour.action('README.md...') + colour.command('created'));
				}
			});
			fs.writeFile('index.html', generate.indexComponent($name), function($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					web.log(colour.command('File: ') + colour.action('index.html...') + colour.command('created'));
				}
			});
			// Create folders and content
			shell.mkdir('-p', 'js');
			shell.mkdir('-p', 'css');
			shell.mkdir('-p', 'build');

			shell.cd(path.join('build'));
			shell.mkdir('-p', 'js');
			shell.cd('js');
			fs.writeFile($name + '.js', generate.codeStart($name, 'js'), function($error) {
				if ($error) {
					web.log(colour.error($error));
				} else {
					web.log(colour.command('File: ') + colour.action('build/js/' + $name + '.js...') + colour.command('created'));
					shell.cd(path.join('..'));
					shell.mkdir('-p', 'sass');
					shell.cd('sass');
					fs.writeFile($name + '.scss', generate.codeStart($name, 'sass-main'), function($error) {
						if ($error) {
							web.log(colour.error($error));
						} else {
							web.log(colour.command('File: ') + colour.action('build/sass/' + $name + '.scss...') + colour.command('created'));
						}
					});
					fs.writeFile('_import.scss', generate.codeStart($name, 'sass-import'), function($error) {
						if ($error) {
							web.log(colour.error($error));
						} else {
							web.log(colour.command('File: ') + colour.action('build/sass/_import.scss...') + colour.command('created'));
						}
					});
				}
			});
		} else {
			web.log(colour.error('No component name provided.'));
		}
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

			fs.writeFile('index.html', generate.indexHTML(), function($error) {
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
