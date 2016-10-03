/**
 * File: lib/colour.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

// Requires
var chalk = require('chalk');

// Colours
var chalkAction = chalk.cyan;
var chalkCommand = chalk.magenta;
var chalkError = chalk.red;
var chalkName = chalk.green;
var chalkNumber = chalk.yellow;
var chalkOption = chalk.cyan;
var chalkText = chalk.white;
var chalkTitle = chalk.yellow;
var chalkWarning = chalk.yellow;

module.exports = {
	action: function(text) {
		return chalkAction(text);
	},
	command: function(text) {
		return chalkCommand(text);
	},
	error: function(text) {
		return chalkError(text);
	},
	name: function(text) {
		return chalkName(text);
	},
	number: function(text) {
		return chalkNumber(text);
	},
	option: function(text) {
		return chalkOption(text);
	},
	text: function(text) {
		return chalkText(text);
	},
	title: function(text) {
		return chalkTitle(text);
	},
	warning: function(text) {
		return chalkWarning(text);
	},
	warningBold: function(text) {
		return chalkWarning.bold(text);
	}
};
