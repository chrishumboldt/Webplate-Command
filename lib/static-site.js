/**
 * File: lib/static-site.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

var colour = require('./colour');
var config = require('./config');
var fm = require('front-matter')
var fs = require('fs');
var path = require('path');
var walker = require('dir-at-st');
var web = require('webplate-tools');

var $v = require('./variable');

module.exports = {
	build: function () {
		// Variables
		var $staticPath = path.join('project', 'build', 'static');

		// Functions
		var renderPages = function ($staticSite) {
			web.log($staticSite);
		};

		// Execute
		fs.stat($staticPath, function ($error) {
			if ($error) {
				web.log(colour.command('Folder: ') + colour.action('project/build/static...') + colour.command('not found'));
				web.log(colour.text('The folder either needs to be created or you are currently not in the Webplate folder at this time.'));
			} else {
				web.log(colour.title('Building your static site...'));
				// Map the static directory
				walker({
					directory: $staticPath,
					find: 'all'
				}, function ($filesFolders) {
					// Build the static site snapshot
					var $staticSite = {
						layouts: [],
						templates: [],
						pages: []
					};
					for (var $i = 0, $len = $filesFolders.length; $i < $len; $i++) {
					   if ($filesFolders[$i].indexOf('_layout') > -1 && $filesFolders[$i].indexOf('.html') > -1) {
							$staticSite.layouts.push($filesFolders[$i]);
						} else if ($filesFolders[$i].indexOf('_template') > -1 && $filesFolders[$i].indexOf('.html') > -1) {
							$staticSite.templates.push($filesFolders[$i]);
						} else if ($filesFolders[$i].indexOf('.md') > -1) {
							$staticSite.pages.push($filesFolders[$i]);
							// fs.readFile($filesFolders[$i], 'utf8', function (err, data) {
							// 	if (err) throw err
							// 	var content = fm(data);
							// 	console.log(content);
							// });
						}
					}

					renderPages($staticSite);
				});
			}
		});
	}
};
