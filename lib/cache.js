/**
 * File: lib/cache.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var config = require('./config');
var web = require('webplate-tools');

module.exports = {
	buildUpdate: function() {
		config.read(function(configData) {
			if (configData.build && configData.cache && configData.cache.bust) {
				configData.cache.bust = Date.now();
				config.write(configData, function() {
					web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('updated'));
				});
			}
		});
	},
	bust: function() {
		config.read(function(configData) {
			if (configData.cache && configData.cache.bust) {
				configData.cache.bust = Date.now();
				config.write(configData, function() {
					web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('updated'));
				});
			} else {
				configData.cache = {
					bust: Date.now()
				};
				config.write(configData, function() {
					web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('created'));
				});
			}
		});
	},
	remove: function() {
		web.log(colour.title('Removing the cache busting from your project config file...'));
		config.read(function(configData) {
			if (configData.cache) {
				delete configData.cache;
				config.write(configData, function() {
					web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('removed'));
				});
			} else {
				web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('none'));
			}
		});
	}
};
