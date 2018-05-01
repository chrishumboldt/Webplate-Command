/*
Author: Chris Humboldt
*/

'use strict';

const Rocket = require('rocket-tools');

module.exports = {
	nameObject: function (name) {
		return {
			capitalised: name.split('-').map(function (nameSplit) {
				return Rocket.string.uppercase.first(nameSplit);
			}).join(''),
			clean: name.replace(/-/g, ''),
			original: name
		}
	},
	cockpitJSON: function (name) {
		return `{
	"build": [{
		"name": "` + name + `",
		"js": ["` + name + `.js"],
		"sass": ["` + name + `.scss"]
	}]
}
`;
	},
	htmlIndex: function () {
		return `<!DOCTYPE html>
<html>
<head>

	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title>Project Name</title>

</head>
<body style="display:none">

	/* Your content goes here */
	<script id="rocket" src="rocket/launch.js"></script>

</body>
</html>
	`;
	},
	moduleIndex: function (name) {
		return `<!DOCTYPE html>
<html>
<head>

	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title>` + Rocket.string.uppercase.first(name) + `</title>
	<link href="css/` + name + `.min.css" rel="stylesheet" type="text/css">

</head>
<body>

	<script src="js/` + name + `.min.js"></script>

</body>
</html>
`;
	},
	moduleJS: function (name) {
		var name = this.nameObject(name);
		return `/**
* File: build/js/` + name.original + `.js
* Type: Javascript file
* Author: --Your Name Here--
**/

// Rocket module extension
// NOTE: You do not need Rocket for this module to be used.
// This allows you to extend Rocket or use independently. Both will work.
var Rocket = (typeof Rocket === 'object') ? Rocket : {};
if (!Rocket.defaults) {
	Rocket.defaults = {};
}
Rocket.defaults.` + name.clean + ` = {
	key: 'value'
};

// Module container
var RockMod_` + name.capitalised + `;
(function (RockMod_` + name.capitalised + `) {
	// Initialiser
	function init (uOptions) {
		/*
		Write your code here.
		*/
	};
	// Exports
	RockMod_` + name.capitalised + `.init = init;
})(RockMod_` + name.capitalised + ` || (RockMod_` + name.capitalised + ` = {}));

// Bind to Rocket object
Rocket.` + name.clean + ` = RockMod_` + name.capitalised + `.init;
`;
	},
	readme: function (name) {
		var name = this.nameObject(name);
		return `# ` + name.capitalised + `
Content goes here.`;
	},
	sassMain: function (name) {
		return `/**
* File: build/sass/` + name + `.scss
* Type: SASS file
* Author: --Your Name Here--
**/

@import "import";

// DELETE THIS
html, body {
	background-colour: white;
}
`;
	},
	sassImport: function () {
		return `/**
* File: build/sass/_import.scss
* Type: SASS import file
* Author: --Your Name Here--
**/`;
	},
	typescript: function (name) {
		return `/**
* File: build/ts/` + name + `.ts
* Type: TypeScript file
* Author: --Your Name Here--
**/`;
	},
	typescriptConfig: function () {
		return `{
	"compilerOptions": {
		"outDir": "../js",
		"target": "es5"
	}
}`;
	}
};
