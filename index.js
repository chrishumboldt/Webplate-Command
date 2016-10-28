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
var staticSite = require('./lib/static-site');
var update = require('./lib/update');
var watch = require('./lib/watch');
var Web = require('webplate-tools');

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
				Web.log(colour.title('cache busting in progress...'));
				cache.bust();
				break;

			case 'remove':
				cache.remove();
				break;

			default:
				Web.log('');
				Web.log(colour.title('What would you like to do with the cache?'));
				Web.log('');
				Web.log(colour.command('bust '));
				Web.log(colour.text('Add or update the cache busting timestamp in your project config file.'));
				Web.log('');
				Web.log(colour.command('remove '));
				Web.log(colour.text('Remove any cache busting timestamps from your project config file.'));
				Web.log('');
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
				Web.log('');
				Web.log(colour.title('What Bower component do you want to manage?'));
				Web.log('');
				Web.log(colour.command('add ') + colour.name('bower_component'));
				Web.log(colour.text('Add a Bower component.'));
				Web.log('');
				Web.log(colour.command('remove ') + colour.name('bower_component'));
				Web.log(colour.text('Remove a Bower component.'));
				Web.log('');
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
				Web.log('');
				Web.log(colour.title('What would you like to create?'));
				Web.log('');
				Web.log(colour.command('build'));
				Web.log(colour.text('Create a new build instance inside your Webplate project.'));
				Web.log('');
				Web.log(colour.command('component ') + colour.name('name'));
				Web.log(colour.text('create a new Webplate component. This can be a standard component or new UI Kit.'));
				Web.log('');
				Web.log(colour.command('project ') + colour.name('name') + colour.option(' <version|tag|optional>'));
				Web.log(colour.text('Create a new Webplate project. You know you want to!'));
				Web.log(colour.text('Please note that the currect command line tool you are using only works with Webplate 4+.'));
				Web.log('');
				break;
		}
		break;

	case 'download':
		download.Webplate(args[1]);
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
		Web.log('');
		Web.log(colour.title('So what command do you want run?'));
		Web.log('');
		Web.log(colour.command('build ') + colour.option('<css|js|engine|component|optional>'));
		Web.log(colour.text('Build your project CSS, Javascript, Webplate engine files or your Webplate component files.'));
		Web.log(colour.text('If no parameter is provided then just the project CSS and Javascript will be built.'));
		Web.log('');
		Web.log(colour.command('cache ') + colour.option('<bust|remove>'));
		Web.log(colour.text('Add, update or remove the global cache busting option from your Webplate project.'));
		Web.log('');
		Web.log(colour.command('create ') + colour.option('<project|component|build> ') + colour.name('name') + colour.option(' <version|tag|optional>'));
		Web.log(colour.text('Create a new Webplate project, component or project build instance, including all required files.'));
		Web.log(colour.text('When creating a build instance, then ') + colour.name('name') + colour.text(' option is not required.'));
		Web.log(colour.text('You will need to be in the Webplate directory for the build instance to work.'));
		Web.log('');
		Web.log(colour.command('component ') + colour.option('<add|remove> ') + colour.name('bower_component'));
		Web.log(colour.text('Add or remove a Bower component of your choice. Bower is really awesome!'));
		Web.log('');
		Web.log(colour.command('download ') + colour.option('<version|tag|optional>'));
		Web.log(colour.text('Download a crisp new copy of Webplate into the current directory.'));
		Web.log(colour.text('If no parameter is provided then the latest version of Webplate will be used.'));
		Web.log('');
		Web.log(colour.command('update ') + colour.option('<version|tag|optional>'));
		Web.log(colour.text('Update the current copy of the Webplate engine and start.js file. This is not a migration tool.'));
		Web.log(colour.text('This will also create a backup folder just in case.'));
		Web.log(colour.text('If no parameter is provided then the latest version of Webplate will be used.'));
		Web.log('');
		Web.log(colour.command('watch') + colour.option(' <component|passive|optional>'));
		Web.log(colour.text('Run the watcher to watch for file changes.'));
		Web.log(colour.text('If the option is set to component then component CSS and JS will be watched.'));
		Web.log(colour.text('If the option is set to passive then only project CSS and JS will be watched.'));
		Web.log(colour.text('If no parameter is provided then the project and engine CSS and JS files will be watched.'));
		Web.log(colour.text('Any change will rebuild your CSS and Javascript and perform a live reload (if installed).'));
		Web.log('');
		break;
}
