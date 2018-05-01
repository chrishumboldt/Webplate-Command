/**
 * @author Chris Humboldt
 */

'use strict';

const Fs = require('fs');
const Path = require('path');
const Rocket = require('rocket-tools');

const Log = require('./log.module');

// Module
module.exports = {
   assemble() {
      return this.returnRocketFileContent({filename: 'assemble.json'});
   },
   cockpit() {
      return this.returnRocketFileContent({filename: 'cockpit.json'});
   },
   returnRocketFileContent({ filename }) {
      return new Promise((resolve, reject) => {
         Fs.readFile(Path.join(filename), (error, data) => {
            if (error) {
               Log.error([
                  `action::${filename}...`,
                  `error::cannot be found`
               ]);
               reject(error);
            } else {
               resolve(JSON.parse(data));
            }
         });
      });
   }
};
