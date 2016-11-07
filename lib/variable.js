/**
 * File: lib/variables.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

var path = require('path');
var Rocket = require('rocket-tools');

// Variables
var pathEngineBuildJS = path.join('engine', 'build', 'js');
var pathEngineComponent = path.join('engine', 'component');

// Execute
module.exports = {
	component: {
		watch: {
			build: [
				path.join('build', 'sass'),
				path.join('build', 'js')
			],
			reload: [
				path.join('css'),
				path.join('js')
			]
		}
	},
	dirName: function() {
		var currentPath = process.cwd();
		return (currentPath.indexOf('/') > -1) ? Rocket.string.lowercase.all((currentPath).substr(currentPath.lastIndexOf('/') + 1)) : Rocket.string.lowercase.all((currentPath).substr(currentPath.lastIndexOf('\\') + 1));
	},
	engine: {
		sass: {
			import: path.join('engine', 'build', 'sass', '_import.scss'),
			main: path.join('engine', 'build', 'sass', 'main.scss'),
			mainLight: path.join('engine', 'build', 'sass', 'main-light.scss')
		},
		main: [
			path.join(pathEngineBuildJS, 'modernizr.js'),
			path.join(pathEngineBuildJS, 'velocity.js'),
	      path.join(pathEngineBuildJS, 'rocket-tools.js')
		],
		components: [
			path.join(pathEngineComponent, 'buttonplate/js/buttonplate.js'),
	      path.join(pathEngineComponent, 'flickerplate/js/flickerplate.js'),
	      path.join(pathEngineComponent, 'formplate/js/formplate.js'),
	      path.join(pathEngineComponent, 'injectplate/js/injectplate.js'),
	      path.join(pathEngineComponent, 'loaderplate/js/loaderplate.js'),
	      path.join(pathEngineComponent, 'menuplate/js/menuplate.js'),
	      path.join(pathEngineComponent, 'messageplate/js/messageplate.js'),
	      path.join(pathEngineComponent, 'modalplate/js/modalplate.js'),
	      path.join(pathEngineComponent, 'tabplate/js/tabplate.js'),
	      path.join(pathEngineBuildJS, 'overwrite.js')
		],
		start: path.join(pathEngineBuildJS, 'core.js'),
		touch: path.join(pathEngineBuildJS, 'fastclick.js')
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
	file: {
		extension: {
			js: ['js', 'coffee'],
			sass: ['scss']
		},
		ignore: {
			prefix: ['_']
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
		sass: [path.join('engine', 'build', 'sass', '_import.scss')],
		watch: {
			build: [
				path.join('engine', 'build', 'sass'),
				path.join('engine', 'build', 'js'),
				path.join('project', 'build', 'sass'),
				path.join('project', 'build', 'js'),
				path.join('project', 'cockpit.json')
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
