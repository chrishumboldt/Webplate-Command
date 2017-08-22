/*
Author: Chris Humboldt
*/

'use strict';

const fs = require('fs');
const message = require('./message');
const Rocket = require('rocket-tools');

module.exports = {
   create: function (path, callback) {
      this.exists(path, function (response) {
         if (!response) {
            fs.mkdir(path);
            message.rocket.dir.created(path);
         }
         callback();
      });
   },
   exists: function (path, callback) {
      // Catch
      if (!Rocket.is.string(path) || !Rocket.is.function(callback)) {
         return false;
      }
      // Continue
      fs.stat(path, function (error, stats) {
         // Catch
         if (error || !stats.isDirectory()) {
            message.rocket.dir.none(path);
            return callback(false);
         }
         // Continue
         return callback(true);
      });
   }
};
