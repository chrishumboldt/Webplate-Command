/**
 * File: lib/variables.js
 * Type: Javascript Node variables
 * Author: Chris Humboldt
 */

var path = require('path');
var web = require('webplate-tools');

// Variables
var $pathEngineBuildJS = path.join('engine', 'build', 'js');
var $pathEngineComponent = path.join('engine', 'component');


	// var $html = '';
	// $html += '<!DOCTYPE html>\n';
	// $html += '<html>\n';
	// $html += '<head>\n\n';
	// $html += '\t<meta charset="utf-8">\n';
	// $html += '\t<meta http-equiv="x-ua-compatible" content="ie=edge">\n';
	// $html += '\t<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n';
	// $html += '\t<title>Project Name</title>\n\n';
	// $html += '</head>\n';
	// $html += '<body>\n\n';
	// $html += '\t<div id="webplate-content" style="display:none">\n';
	// $html += '\t\t/* Your content goes here */\n';
	// $html += '\t</div>\n\n';
	// $html += '\t<script id="webplate" src="webplate/start.js"></script>\n\n';
	// $html += '</body>\n';
	// $html += '</html>\n';

// Execute
module.exports = {
	dirName: function() {
		var $currentPath = process.cwd();
		return ($currentPath.indexOf('/') > -1) ? web.lowercaseAll(($currentPath).substr($currentPath.lastIndexOf('/') + 1)) : web.lowercaseAll(($currentPath).substr($currentPath.lastIndexOf('\\') + 1));
	},
	engine: {
		sass: path.join('engine', 'build', 'sass', 'styles.scss'),
		scripts: [
			path.join($pathEngineBuildJS, 'modernizr.js'),
			path.join($pathEngineBuildJS, 'velocity.js'),
			path.join($pathEngineComponent, 'buttonplate/js/buttonplate.js'),
	      path.join($pathEngineComponent, 'flickerplate/js/flickerplate.js'),
	      path.join($pathEngineComponent, 'formplate/js/formplate.js'),
	      path.join($pathEngineComponent, 'injectplate/js/injectplate.js'),
	      path.join($pathEngineComponent, 'loaderplate/js/loaderplate.js'),
	      path.join($pathEngineComponent, 'menuplate/js/menuplate.js'),
	      path.join($pathEngineComponent, 'messageplate/js/messageplate.js'),
	      path.join($pathEngineComponent, 'modalplate/js/modalplate.js'),
	      path.join($pathEngineComponent, 'tabplate/js/tabplate.js'),
	      path.join($pathEngineBuildJS, 'tools.js'),
	      path.join($pathEngineBuildJS, 'overwrite.js')
		],
		start: path.join($pathEngineBuildJS, 'core.js'),
		touch: path.join($pathEngineBuildJS, 'fastclick.js')
	},
	html: {
		index: `<!DOCTYPE html>
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
		`
	},
	options: {
		uglify: {
			mangle: true,
			compress: {
				sequences: true,
				dead_code: true,
				conditionals: true,
				booleans: true,
				unused: true,
				if_return: true,
				join_vars: true,
				drop_console: false
			}
		}
	},
	path: {
		current: process.cwd(),
		engine: {
			root: path.join('engine'),
			build: {
				sass: path.join('engine', 'build', 'sass'),
				js: path.join('engine', 'build', 'js')
			},
			component: path.join('engine', 'component'),
			css: path.join('engine', 'css'),
			js: path.join('engine', 'js')
		},
		project: {
			root: path.join('project'),
			build: {
				js: path.join('project', 'build', 'js'),
				sass: path.join('project', 'build', 'sass')
			},
			component: path.join('project', 'component'),
			css: path.join('project', 'css'),
			js: path.join('project', 'js')
		}
	},
	project: {
		js: [],
		sass: [path.join('engine', 'build', 'sass', 'import.scss')],
		watch: {
			build: [
				path.join('engine', 'build', 'sass'),
				path.join('engine', 'build', 'js'),
				path.join('project', 'build', 'sass'),
				path.join('project', 'build', 'js'),
				path.join('project', 'config.json')
			],
			reload: [
				path.join('engine', 'css'),
				path.join('engine', 'js'),
				path.join('project', 'css'),
				path.join('project', 'js'),
				path.join('start.js')
			]
		}
	}
};
