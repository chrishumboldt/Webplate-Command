#!/usr/bin/env node

/**
 * @author Chris Humboldt
 */

'use strict';

const Assemble = require('./module/assemble.module');
const Rocket = require('rocket-tools');

// Variables
const args = process.argv.slice(2);
const command = args[0];

// Execute
switch (command) {
   case 'assemble':
      switch (args[1]) {
         case 'javascript':
            Assemble.javascript();
            break;

         default:
            Assemble.javascript();
      }
      break;

   default:
      Rocket.log('The default command goes here.');
}
