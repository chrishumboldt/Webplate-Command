#!/usr/bin/env node

/*
Author: Chris Humboldt
*/

'use strict';

// Requires
const build = require('./lib/build');
const cache = require('./lib/cache');
const colour = require('./lib/colour');
const create = require('./lib/create');
const download = require('./lib/download');
const engine = require('./lib/engine');
const message = require('./lib/message');
const Rocket = require('rocket-tools');
const update = require('./lib/update');
const watch = require('./lib/watch');

// Variables
const args = process.argv.slice(2);
const command = args[0];

// Execute
switch (command) {
   case 'build':
      switch (args[1]) {
         case 'css':
            build.init('css');
            break;

         case 'js':
            build.init('js');
            break;

         case 'engine':
            engine.build.all();
            break;

         default:
            build.init('all');
      }
      break;

   case 'cache':
      switch (args[1]) {
         case 'bust':
            message.rocket.cache.starting();
            cache.bust();
            break;

         case 'remove':
            message.rocket.cache.removing();
            cache.remove();
            break;

         default:
            Rocket.log('');
            Rocket.log(colour.title('What would you like to do with the cache?'));
            Rocket.log('');
            Rocket.log(colour.command('bust '));
            Rocket.log(colour.text('Add or update the cache busting timestamp from your Rocket cockpit.json file.'));
            Rocket.log('');
            Rocket.log(colour.command('remove '));
            Rocket.log(colour.text('Remove any cache busting timestamps from your Rocket cockpit.json file.'));
            Rocket.log('');
      }
      break;

   case 'create':
      switch (args[1]) {
         case 'build':
            create.build('./', args[2]);
            break;

         case 'project':
            create.project(args[2], args[3]);
            break;

         case 'module':
            create.rcModule(args[2]);
            break;

         default:
            Rocket.log('');
            Rocket.log(colour.title('What would you like to create?'));
            Rocket.log('');
            Rocket.log(colour.command('build'));
            Rocket.log(colour.text('Create a new build instance inside your Rocket project.'));
            Rocket.log('');
            Rocket.log(colour.command('module ') + colour.name('name'));
            Rocket.log(colour.text('create a new Rocket module. This can be a standard module or new UI Kit.'));
            Rocket.log('');
            Rocket.log(colour.command('project ') + colour.name('name') + colour.option(' <version|tag|optional>'));
            Rocket.log(colour.text('Create a new Rocket project. You know you want to!'));
            Rocket.log(colour.text('Please note that the currect command line tool you are using only works with Rocket 4+.'));
            Rocket.log('');
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
         case 'passive':
            watch.passive();
            break;

         default:
            watch.build();
      }
      break;

   default:
      Rocket.log('');
      Rocket.log(colour.title('So what command do you want run?'));
      Rocket.log('');
      Rocket.log(colour.command('build ') + colour.option('<css|js|engine|optional>'));
      Rocket.log(colour.text('Build your CSS, Javascript, Rocket engine files or your Rocket module files.'));
      Rocket.log('');
      Rocket.log(colour.command('cache ') + colour.option('<bust|remove>'));
      Rocket.log(colour.text('Add, update or remove the cache busting timestamp from your Rocket cockpit.json file..'));
      Rocket.log(colour.text('If set, all file inclusions will have a timestamp query string attached to the filename.'));
      Rocket.log('');
      Rocket.log(colour.command('create ') + colour.option('<project|module|build> ') + colour.name('name') + colour.option(' <version|tag|optional>'));
      Rocket.log(colour.text('Create a new Rocket project, module or project build instance, including all required files.'));
      Rocket.log(colour.text('When creating a build instance, then ') + colour.name('name') + colour.text(' option is not required.'));
      Rocket.log(colour.text('You will need to be in the Rocket directory for the build instance to work.'));
      Rocket.log('');
      Rocket.log(colour.command('download ') + colour.option('<version|tag|optional>'));
      Rocket.log(colour.text('Download a crisp new copy of Rocket into the current directory.'));
      Rocket.log(colour.text('If no parameter is provided then the latest version of Rocket will be used.'));
      Rocket.log('');
      Rocket.log(colour.command('update ') + colour.option('<version|tag|optional>'));
      Rocket.log(colour.text('Update the current copy of the Rocket engine and launch.js file. This is not a migration tool.'));
      Rocket.log(colour.text('This will also create a backup folder just in case.'));
      Rocket.log(colour.text('If no parameter is provided then the latest version of Rocket will be used.'));
      Rocket.log('');
      Rocket.log(colour.command('watch') + colour.option(' <passive|optional>'));
      Rocket.log(colour.text('Run the watcher to watch for file changes.'));
      Rocket.log(colour.text('If the option is set to passive then only CSS and JS will be watched.'));
      Rocket.log(colour.text('If no parameter is provided then the CSS, JS and engine CSS and JS files will be watched.'));
      Rocket.log(colour.text('Any change will rebuild your CSS and Javascript and perform a live reload (if installed).'));
      Rocket.log('');
}
