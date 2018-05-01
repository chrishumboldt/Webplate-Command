/**
 * @author Chris Humboldt
 */

'use strict';

const Rocket = require('rocket-tools');

const Read = require('./read.module');

module.exports = {
   javascript() {
      Read.assemble()
      .then(data => {
         Rocket.log(data);
      })
      .catch(error => {});
   }
};
