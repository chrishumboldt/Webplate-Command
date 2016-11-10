#!/usr/bin/env node

/**
 * File: index.js
 * Type: Node.js module file
 * Author: Chris Humboldt
**/

'use strict';

// Requires
var cache = require('./lib/cache');
var colour = require('./lib/colour');
var create = require('./lib/create');
var component = require('./lib/component');
var download = require('./lib/download');
var engine = require('./lib/engine');
var project = require('./lib/project');
var Rocket = require('rocket-tools');
var staticSite = require('./lib/static-site');
var update = require('./lib/update');
var watch = require('./lib/watch');

// Variables
var args = process.argv.slice(2);
var command = args[0];

// Execute
switch (command) {
	case 'build':
		switch (args[1]) {
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
		switch (args[1]) {
			case 'bust':
				Rocket.log(colour.title('cache busting in progress...'));
				cache.bust();
				break;

			case 'remove':
				cache.remove();
				break;

			default:
				Rocket.log('');
				Rocket.log(colour.title('What would you like to do with the cache?'));
				Rocket.log('');
				Rocket.log(colour.command('bust '));
				Rocket.log(colour.text('Add or update the cache busting timestamp in your project config file.'));
				Rocket.log('');
				Rocket.log(colour.command('remove '));
				Rocket.log(colour.text('Remove any cache busting timestamps from your project config file.'));
				Rocket.log('');
				break;
		}
		break;

	case 'component':
		switch (args[1]) {
			case 'add':
				component.add(args[2]);
				break;
			case 'remove':
				component.remove(args[2]);
				break;
			default:
				Rocket.log('');
				Rocket.log(colour.title('What NPM package do you want to manage?'));
				Rocket.log('');
				Rocket.log(colour.command('add ') + colour.name('package_name'));
				Rocket.log(colour.text('Add an NPM package.'));
				Rocket.log('');
				Rocket.log(colour.command('remove ') + colour.name('package_name'));
				Rocket.log(colour.text('Remove an NPM package.'));
				Rocket.log('');
				break;
		}
		break;

	case 'create':

		switch (args[1]) {
			case 'build':
				create.build();
				break;
			case 'project':
				create.project(args[2], args[3]);
				break;
			case 'component':
				create.component(args[2]);
				break;
			default:
				Rocket.log('');
				Rocket.log(colour.title('What would you like to create?'));
				Rocket.log('');
				Rocket.log(colour.command('build'));
				Rocket.log(colour.text('Create a new build instance inside your Rocket project.'));
				Rocket.log('');
				Rocket.log(colour.command('component ') + colour.name('name'));
				Rocket.log(colour.text('create a new Rocket component. This can be a standard component or new UI Kit.'));
				Rocket.log('');
				Rocket.log(colour.command('project ') + colour.name('name') + colour.option(' <version|tag|optional>'));
				Rocket.log(colour.text('Create a new Rocket project. You know you want to!'));
				Rocket.log(colour.text('Please note that the currect command line tool you are using only works with Rocket 4+.'));
				Rocket.log('');
				break;
		}
		break;

	case 'download':
		download.rocket(args[1]);
		break;

	case 'update':
		update.engine(args[1]);
		break;

	case 'watch':
		switch (args[1]) {
			case 'component':
				watch.component();
				break;
			case 'passive':
				watch.passive();
				break;
			default:
				watch.project();
				break;
		}
		break;

	default:
		Rocket.log('');
		Rocket.log(colour.title('So what command do you want run?'));
		Rocket.log('');
		Rocket.log(colour.command('build ') + colour.option('<css|js|engine|component|optional>'));
		Rocket.log(colour.text('Build your project CSS, Javascript, Rocket engine files or your Rocket component files.'));
		Rocket.log(colour.text('If no parameter is provided then just the project CSS and Javascript will be built.'));
		Rocket.log('');
		Rocket.log(colour.command('cache ') + colour.option('<bust|remove>'));
		Rocket.log(colour.text('Add, update or remove the global cache busting option from your Rocket project.'));
		Rocket.log('');
		Rocket.log(colour.command('create ') + colour.option('<project|component|build> ') + colour.name('name') + colour.option(' <version|tag|optional>'));
		Rocket.log(colour.text('Create a new Rocket project, component or project build instance, including all required files.'));
		Rocket.log(colour.text('When creating a build instance, then ') + colour.name('name') + colour.text(' option is not required.'));
		Rocket.log(colour.text('You will need to be in the Rocket directory for the build instance to work.'));
		Rocket.log('');
		Rocket.log(colour.command('component ') + colour.option('<add|remove> ') + colour.name('package_name'));
		Rocket.log(colour.text('Add or remove an NPM package of your choice. NPM is awesome!'));
		Rocket.log(colour.text('Rocket sees all NPM packages as front-end components.'));
		Rocket.log('');
		Rocket.log(colour.command('download ') + colour.option('<version|tag|optional>'));
		Rocket.log(colour.text('Download a crisp new copy of Rocket into the current directory.'));
		Rocket.log(colour.text('If no parameter is provided then the latest version of Rocket will be used.'));
		Rocket.log('');
		Rocket.log(colour.command('update ') + colour.option('<version|tag|optional>'));
		Rocket.log(colour.text('Update the current copy of the Rocket engine and start.js file. This is not a migration tool.'));
		Rocket.log(colour.text('This will also create a backup folder just in case.'));
		Rocket.log(colour.text('If no parameter is provided then the latest version of Rocket will be used.'));
		Rocket.log('');
		Rocket.log(colour.command('watch') + colour.option(' <component|passive|optional>'));
		Rocket.log(colour.text('Run the watcher to watch for file changes.'));
		Rocket.log(colour.text('If the option is set to component then component CSS and JS will be watched.'));
		Rocket.log(colour.text('If the option is set to passive then only project CSS and JS will be watched.'));
		Rocket.log(colour.text('If no parameter is provided then the project and engine CSS and JS files will be watched.'));
		Rocket.log(colour.text('Any change will rebuild your CSS and Javascript and perform a live reload (if installed).'));
		Rocket.log('');
		break;
}
