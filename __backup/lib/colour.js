/*
Author: Chris Humboldt
*/

'use strict';

// Requires
const chalk = require('chalk');

// Colours
const chalkAction = chalk.cyan;
const chalkCommand = chalk.magenta;
const chalkError = chalk.red;
const chalkName = chalk.green;
const chalkNumber = chalk.yellow;
const chalkOption = chalk.cyan;
const chalkText = chalk.white;
const chalkTitle = chalk.yellow;
const chalkWarning = chalk.yellow;

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
