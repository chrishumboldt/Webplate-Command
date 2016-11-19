/**
 * File: lib/cache.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var colour = require('./colour');
var cockpit = require('./cockpit');
var message = require('./message');
var Rocket = require('rocket-tools');

module.exports = {
	bust: function(createCache) {
		var createCache = (Rocket.is.boolean(createCache)) ? createCache : true;
		cockpit.read(false, function(cockpitData) {
			if (cockpitData.cache && cockpitData.cache.bust) {
				cockpitData.cache.bust = Date.now();
				cockpit.write(false, cockpitData, function() {
					message.rocket.cache.updated();
				});
			} else if (createCache) {
				cockpitData.cache = {
					bust: Date.now()
				};
				cockpit.write(false, cockpitData, function() {
					message.rocket.cache.created();
				});
			}
		});
	},
	remove: function() {
		cockpit.read(false, function(cockpitData) {
			if (cockpitData.cache) {
				delete cockpitData.cache;
				cockpit.write(false, cockpitData, function() {
					message.rocket.cache.removed();
				});
			} else {
				message.rocket.cache.noProperty();
			}
		});
	}
};
