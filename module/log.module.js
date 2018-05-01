/**
 * @author Chris Humboldt
 */

'use strict';

const Chalk = require('chalk');
const Rocket = require('rocket-tools');

// Functions
function error(messages) {
   if (!Rocket.is.array(messages)) return;

   let output = Chalk.red('Error: ');
   output += messageSplitter({messages});

   // Log output
   Rocket.log(output);
}

function messageSplitter({ messages }) {
   if (!Rocket.is.array(messages)) return;

   let output = '';

   messages.forEach(message => {
      const messageSplit = message.split('::');
      const messageType = (messageSplit[0] || false);
      const messageBody = (messageSplit[1] || false);

      if (messageType && messageBody) {
         switch (messageType) {
            case 'action':
               output += Chalk.cyan(messageBody);
               break;

            case 'error':
               output += Chalk.red(messageBody);
               break;

            case 'text':
               output += Chalk.white(messageBody);
               break;
         }
      }
   });

   return output;
}

// Expose
module.exports = {error};
