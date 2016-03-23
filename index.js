#!/usr/bin/env node

/**
 * File: index.js
 * Type: Javascript index file
 * Author: Chris Humboldt
 */

'use strict';

// Requires
var colour = require('./lib/log-colour');
var component = require('./lib/component');
var engine = require('./lib/engine');
var project = require('./lib/project');
var watch = require('./lib/watch');
var web = require('webplate-tools');

// Variables
var $arguments = process.argv.slice(2);
var $command = $arguments[0];

// Execute
switch ($command) {

	case 'build':
		switch ($arguments[1]) {
			case 'css':
				project.build.css();
				break;
			case 'js':
				project.build.js();
				break;
			case 'engine':
				engine.build.all();
				break;
			case 'component':
				// component.build();
				break;
			case 'ui':
				// ui.build();
				break;
			default:
				project.build.all();
				break;
		}
		break;

	case 'component':
		switch ($arguments[1]) {
			case 'add':
				component.add($arguments[2]);
				break;
			case 'remove':
				component.remove($arguments[2]);
				break;
			default:
				web.log('');
				web.log(colour.title('What Bower component do you want to install?'));
				web.log(colour.command('webplate component add ') + colour.option('<bower_component>'));
				web.log('');
				break;
		}
		break;

	case 'create':
		break;

	case 'download':
		break;

	case 'watch':
		if ($arguments[1] === 'passive') {
			watch.passive();
		} else {
			watch.project();
		}
		break;

	default:
		web.log('');
		web.log(colour.title('So what command do you want run?'));
		web.log('');
		web.log(colour.number('1)') + colour.command(' build'));
		web.log(colour.text('Build your project CSS and Javascript.'));
		web.log('');
		web.log(colour.number('2)') + colour.command(' build ') + colour.option('<css|js|engine|component|ui>'));
		web.log(colour.text('Build your project CSS or Javascript, Webplate Engine files, Webplate component files or your Webplate UI files.'));
		web.log('');
		web.log(colour.number('3)') + colour.command(' create ') + colour.option('<project_name> <version|tag|optional>'));
		web.log(colour.text('Create a new project with a fresh copy of Webplate and a starter index.html file.'));
		web.log('');
		web.log(colour.number('4)') + colour.command(' component add ') + colour.option('<bower_component>'));
		web.log(colour.text('Install a new Bower component of your choice. Bower is really awesome!'));
		web.log('');
		web.log(colour.number('5)') + colour.command(' download ') + colour.option('<version|tag|optional>'));
		web.log(colour.text('Download a crisp new copy of Webplate in the current directory.'));
		web.log('');
		web.log(colour.number('6)') + colour.command(' watch'));
		web.log(colour.text('Run the project watcher to watch for file changes. Any change will rebuild your CSS and Javascript and perform a live reload (if installed).'));
		web.log('');
		break;
}