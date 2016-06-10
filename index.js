#!/usr/bin/env node

/**
 * File: index.js
 * Type: Javascript index file
 * Author: Chris Humboldt
 */

'use strict';

// Requires
var cache = require('./lib/cache');
var colour = require('./lib/colour');
var create = require('./lib/create');
var component = require('./lib/component');
var download = require('./lib/download');
var engine = require('./lib/engine');
var project = require('./lib/project');
var staticSite = require('./lib/static-site');
var update = require('./lib/update');
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
				component.build();
				break;
			case 'static':
				staticSite.build();
				break;
			default:
				project.build.all();
				break;
		}
		break;

	case 'cache':
		switch ($arguments[1]) {
			case 'bust':
				web.log(colour.title('Cache busting in progress...'));
				cache.bust();
				break;

			case 'remove':
				cache.remove();
				break;

			default:
				web.log('');
				web.log(colour.title('What would you like to do with the cache?'));
				web.log('');
				web.log(colour.command('bust '));
				web.log(colour.text('Add or update the cache busting timestamp in your project config file.'));
				web.log('');
				web.log(colour.command('remove '));
				web.log(colour.text('Remove any cache busting timestamps from your project config file.'));
				web.log('');
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
				web.log(colour.title('What Bower component do you want to manage?'));
				web.log('');
				web.log(colour.command('add ') + colour.name('bower_component'));
				web.log(colour.text('Add a Bower component.'));
				web.log('');
				web.log(colour.command('remove ') + colour.name('bower_component'));
				web.log(colour.text('Remove a Bower component.'));
				web.log('');
				break;
		}
		break;

	case 'create':

		switch ($arguments[1]) {
			case 'project':
				create.project($arguments[2], $arguments[3]);
				break;
			case 'component':
				create.component($arguments[2]);
				break;
			default:
				web.log('');
				web.log(colour.title('What would you like to create?'));
				web.log('');
				web.log(colour.command('component ') + colour.name('name'));
				web.log(colour.text('Create a new webplate component. This can be a standard component or new UI Kit.'));
				web.log('');
				web.log(colour.command('project ') + colour.name('name') + colour.option(' <version|tag|optional>'));
				web.log(colour.text('Create a new Webplate project. You know you want to!'));
				web.log(colour.text('Please note that the currect command line tool you are using only works with Webplate 4+.'));
				web.log('');
				break;
		}
		break;

	case 'download':
		download.webplate($arguments[1]);
		break;

	case 'update':
		update.engine($arguments[1]);
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
		web.log(colour.command('build ') + colour.option('<css|js|engine|component|optional>'));
		web.log(colour.text('Build your project CSS, Javascript, Webplate Engine files or your Webplate component files.'));
		web.log(colour.text('If no parameter is provided then just the project CSS and Javascript will be built.'));
		web.log('');
		web.log(colour.command('cache ') + colour.option('<bust|remove>'));
		web.log(colour.text('Add, update or remove the global cache busting option from your Webplate project.'));
		web.log('');
		web.log(colour.command('create ') + colour.option('<project|component> ') + colour.name('name') + colour.option(' <version|tag|optional>'));
		web.log(colour.text('Create a new Webplate project or component, including all required files.'));
		web.log('');
		web.log(colour.command('component ') + colour.option('<add|remove> ') + colour.name('bower_component'));
		web.log(colour.text('Add or remove a Bower component of your choice. Bower is really awesome!'));
		web.log('');
		web.log(colour.command('download ') + colour.option('<version|tag|optional>'));
		web.log(colour.text('Download a crisp new copy of Webplate into the current directory.'));
		web.log(colour.text('If no parameter is provided then the latest version of Webplate will be used.'));
		web.log('');
		web.log(colour.command('update ') + colour.option('<version|tag|optional>'));
		web.log(colour.text('Update the current copy of the Webplate engine and start.js file. This is not a migration tool.'));
		web.log(colour.text('This will also create a backup folder just in case.'));
		web.log(colour.text('If no parameter is provided then the latest version of Webplate will be used.'));
		web.log('');
		web.log(colour.command('watch'));
		web.log(colour.text('Run the project watcher to watch for file changes.'));
		web.log(colour.text('Any change will rebuild your CSS and Javascript and perform a live reload (if installed).'));
		web.log('');
		break;
}
