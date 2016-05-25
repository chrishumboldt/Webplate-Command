/**
 * File: lib/generate.js
 * Type: Javascript Node module
 * Author: Chris Humboldt
 */

module.exports = {
	codeStart: function ($name, $type) {
		var $nameClean = $name.replace(/-/g, '');
		if ($type === 'js') {
			return `/**
 * File: build/js/` + $name + `.js
 * Type: Javascript Component File
 * Author:
 */

// Defaults
var $` + $nameClean + `Default = {};

// Component
var ` + $nameClean + ` = function($userOptions) {
	// Variables
	var $self = this;
	$userOptions = $userOptions || false;
};
`;
		} else if ($type === 'sass-main') {
			return `/**
 * File: build/sass/` + $nameClean + `.scss
 * Type: SASS Component File
 * Author:
 */

@import "import";

// DELETE THIS
html, body {
	background-colour: white;
}
`;
		} else if ($type === 'sass-import') {
			return `/**
 * File: build/sass/_import.scss
 * Type: SASS Component File
 * Author:
 */`;
		}
	},
	indexComponent: function ($name) {
		return `<!DOCTYPE html>
<html>
<head>

	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title>` + $name + ` Component</title>
	<link href="css/` + $name + `.min.css" rel="stylesheet" type="text/css">

</head>
<body>

	<script src="js/` + $name + `.min.js"></script>

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

	<div id="webplate-content" style="display:none">
		/* Your content goes here */
	</div>

	<script id="webplate" src="webplate/start.js"></script>

</body>
</html>
	`;
	},
	readme: function ($name) {
		return `# ` + $name + `
Describe your component here.`;
	}
};
