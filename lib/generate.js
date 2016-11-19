/**
 * File: lib/generate.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var Rocket = require('rocket-tools');

module.exports = {
	codeStart: function (name, type) {
		var nameClean = name.replace(/-/g, '');
		var nameUpper = name.split('-').map(function (nameSplit) {
			return Rocket.string.uppercase.first(nameSplit);
		}).join('');

		// Types
		if (type === 'cockpit.json') {
			return `{
	"build": [{
		"name": "` + name + `",
		"js": ["` + name + `.js"],
		"sass": ["` + name + `.scss"]
	}]
}
`;
		} else if (type === 'js') {
			return `/**
 * File: build/js/` + name + `.js
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
Rocket.defaults.` + nameClean + ` = {
    key: 'value'
};

// Module container
var RockMod_` + nameUpper + `;
(function (RockMod_` + nameUpper + `) {
	// Initialiser
	function init (uOptions) {
		/*
		Write your code here.
		*/
	};
	// Exports
	RockMod_` + nameUpper + `.init = init;
})(RockMod_` + nameUpper + ` || (RockMod_` + nameUpper + ` = {}));

// Bind to Rocket object
Rocket.` + nameClean + ` = RockMod_` + nameUpper + `.init;
`;
		} else if (type === 'sass-main') {
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
		} else if (type === 'sass-import') {
			return `/**
 * File: build/sass/_import.scss
 * Type: SASS import file
 * Author: --Your Name Here--
**/`;
		} else if (type === 'typescript-config') {
			return `{
	"compilerOptions": {
		"outDir": "../js",
		"target": "es5"
	}
}`;
		} else if (type === 'typescript') {
			return `/**
 * File: build/ts/` + name + `.ts
 * Type: TypeScript file
 * Author: --Your Name Here--
**/`;
		}
	},
	indexComponent: function (name) {
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
	indexHTML: function () {
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
	readme: function (name) {
		return `# ` + Rocket.string.uppercase.first(name) + `
Content goes here.`;
	}
};
