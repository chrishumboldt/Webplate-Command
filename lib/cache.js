/*
Author: Chris Humboldt
*/

'use strict';

const colour = require('./colour');
const cockpit = require('./cockpit');
const message = require('./message');
const Rocket = require('rocket-tools');

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
