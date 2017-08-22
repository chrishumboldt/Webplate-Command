/*
Author: Chris Humboldt
*/

'use strict';

const path = require('path');
const Rocket = require('rocket-tools');

// Variables
var pathEngineBuildJS = path.join('engine', 'build', 'js');
var pathEngineComponent = path.join('engine', 'component');

// Execute
module.exports = {
	build: {
		outputPath: {
			css: path.join('css'),
			js: path.join('js')
		},
      root: path.join('build'),
		subExtension: '.min'
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
			path.join(pathEngineComponent, 'rocket-tools/build/js/tools.js')
		],
		components: [
			path.join(pathEngineComponent, 'animejs/anime.js'),
		],
		launch: [
			path.join(pathEngineComponent, 'requirejs/require.js'),
			path.join(pathEngineBuildJS, 'core.js')
		],
		overwrite: [
			path.join(pathEngineBuildJS, 'overwrite.js')
		],
		touch: path.join(pathEngineComponent, 'fastclick/lib/fastclick.js')
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
			prefix: ['_', '.']
		}
	},
	path: {
		component: path.join('node_modules'),
		config: path.join('cockpit.json'),
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
		}
	},
	reload: [
		path.join('css'),
		path.join('js'),
		path.join('launch.js'),
	]
};
