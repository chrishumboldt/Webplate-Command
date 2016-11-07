/**
 * File: lib/generate.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var Rocket = require('rocket-tools');

module.exports = {
	codeStart: function (name, type) {
		var nameClean = name.replace(/-/g, '');
		if (type === 'js') {
			return `/**
 * File: build/js/` + name + `.js
 * Type: Javascript file
 * Author:
**/

var ` + nameClean + ` = (function () {
	// Variables
	var defaults = {};

	// Initialiser
	var init = function () {};

	// Return
	return {
		defaults: defaults,
		init: init
	}
})();
`;
		} else if (type === 'sass-main') {
			return `/**
 * File: build/sass/` + nameClean + `.scss
 * Type: SASS file
 * Author:
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
 * Author:
**/`;
		} else if (type === 'typescript-config') {
			return `{
	"compilerOptions": {
		"outDir": "../js",
		"target": "ES5"
	}
}`;
		} else if (type === 'typescript') {
			return `/**
 * File: build/ts/` + name + `.ts
 * Type: TypeScript file
 * Author:
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
<body>

	<div id="rocket-content" style="display:none">
		/* Your content goes here */
	</div>

	<script id="rocket" src="rocket/start.js"></script>

</body>
</html>
	`;
	},
	readme: function (name) {
		return `# ` + Rocket.string.uppercase.first(name) + `
Content goes here.`;
	},
	rocketJson: function (component) {
		return `{
	"name": "` + component + `",
	"files": [
		"css/` + component + `.min.css",
		"js/` + component + `.min.js"
	],
	"_comment": "This file needs to be included because bower.json does not have a production files property. This file is not referenced for Rocket buiding. For that the bower.json main property will be used."
}`
	}
};
