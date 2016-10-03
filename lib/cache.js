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
		config.read(function(config) {
			if (config.build && config.cache && config.cache.bust) {
				config.cache.bust = Date.now();
				config.write(config, function() {
					web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('updated'));
				});
			}
		});
	},
	bust: function() {
		config.read(function(config) {
			if (config.cache && config.cache.bust) {
				config.cache.bust = Date.now();
				config.write(config, function() {
					web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('updated'));
				});
			} else {
				config.cache = {
					bust: Date.now()
				};
				config.write(config, function() {
					web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('created'));
				});
			}
		});
	},
	remove: function() {
		web.log(colour.title('Removing the cache busting from your project config file...'));
		config.read(function(config) {
			if (config.cache) {
				delete config.cache;
				config.write(config, function() {
					web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('removed'));
				});
			} else {
				web.log(colour.command('Config: ') + colour.action('Cache bust...') + colour.command('none'));
			}
		});
	}
};
