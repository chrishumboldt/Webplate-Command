/**
 * File: lib/build.js
 * Type: Javascript node module
 * Author: Chris Humboldt
**/

// Requires
var cache = require('./cache');
var colour = require('./colour');
var coffeeScript = require('coffee-script');
var cockpit = require('./cockpit');
var cssmin = require('cssmin');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var Rocket = require('rocket-tools');
var sassify = require('node-sass');
var uglify = require('uglify-js');
var walker = require('dir-at-st');

var v = require('./variable');

module.exports = {
   all: function (startMessage) {
      // Variables
      var self = this;
      var startMessage = (Rocket.is.boolean(startMessage)) ? startMessage : true;

      // Check for directory
      self.hasDirectory({
         name: 'build',
         message: true
      }, function (response) {
         // Catch
         if (!response) {
            message.rocket.dir.noBuild();
            return false;
         }
         // Continue
         cockpit.read(false, function (json) {
            // Catch
				if (!json) {
					return false;
				};
            if (!Rocket.is.object(json) || !Rocket.is.array(json.build)) {
               message.rocket.build.none();
               return false;
            }
            // Continue
            if (startMessage) { message.rocket.build.all(); }
            // Run builds
            self.css();
            self.js();
            // Bust cache
            if (v.dirName() === 'rocket') {
               cache.bust(false);
            }
         });
      });
   },
   css: function () {
      // Variables
      var self = this;
      var directoryMade = false;

      // Check for directory
      self.hasDirectory({
         name: 'build',
         message: true
      }, function (response) {
         // Catch
         if (!response) {
            message.rocket.dir.noBuild();
            return false;
         }
         // Continue
         self.hasDirectory({
            name: 'css',
            message: false
         }, function (response) {
            // Run build
            cockpit.read(false, function (json) {
               // Catch
					if (!json) {
						return false;
					};
               if (!Rocket.is.object(json) || !Rocket.is.array(json.build)) {
                  message.rocket.build.noneSmall();
                  return false;
               }
               // Continue
               for (var i = 0, len = json.build.length; i < len; i++) {
                  // Validate
                  if (self.validate.build(json.build[i], 'css')) {
                     // Create directory
                     if (!response && !directoryMade) {
                        directoryMade = true;
                        fs.mkdir('css');
                     }
                     // Execute
                     self.cssExecute(json.build[i]);
                  }
               }
            });
         });
      });
   },
   cssExecute: function (obj) {
      // Check
      if (!Rocket.is.object(obj)) {
         return false;
      }
      // Variables
      var outputPath = (Rocket.exists(obj.outputPath) && Rocket.exists(obj.outputPath.css)) ? obj.outputPath.css : v.build.outputPath.css;
      var subExtension = (Rocket.exists(obj.subExtension)) ? obj.subExtension : v.build.subExtension;
      var nameFull = obj.name + subExtension + '.css';

      var fileData = '';
      var fileOutputPath = path.join(outputPath, nameFull);

      for (var i = 0, len = obj.styles.length; i < len; i++) {
         var file = obj.styles[i];
         var ext = Rocket.get.extension(file);

         switch (ext) {
            case 'scss':
               var sassData = (v.dirName() === 'rocket') ? '@import "engine/build/sass/import.scss";' : '';
               if (file.substring(0,3) === '../') {
                  sassData += '@import "' + file.replace(/(\.\.\/)/g, '') + '";';
               } else {
                  sassData += '@import "build/sass/' + file + '";';
               }
               sassData = sassData.replace(/(\.scss)/g, '');
               fileData += sassify.renderSync({
                  data: sassData,
                  outputStyle: 'compressed'
               }).css.toString();
               break;
            default:
               fileData += fs.readFileSync(path.join('build', 'css', file), 'utf8');
         }
      }

      // Write file
      // Catch
      if (fileData.length <= 0) {
         Rocket.log(colour.command('CSS: ') + colour.action(nameFull + '...') + colour.error('fail (The resulting file was empty)'));
      }
      // Continue
      var minified = cssmin(fileData);
      // var minified = fileData;
      fs.writeFile(fileOutputPath, minified, function(error) {
         // Catch
         if (error) {
            Rocket.log(colour.error(error));
            return false;
         }
         // Continue
         Rocket.log(colour.command('CSS: ') + colour.action(nameFull + '...') + colour.command('successful'));
      });
   },
   hasDirectory: function (obj, callback) {
      // Catchs
      if (!Rocket.is.object(obj) || !Rocket.is.function(callback)) {
         return false;
      }
      if (!Rocket.is.string(obj.name) || !Rocket.is.boolean(obj.message)) {
         return false;
      }
      // Continue
      fs.stat(path.join(obj.name), function (error) {
         // Catch
         if (error) {
				if (obj.messaage) { message.rocket.dir.none(obj.name) };
            return callback(false);
         }
         // Continue
         return callback(true);
      });
   },
   js: function () {
      // Variables
      var self = this;
      var directoryMade = false;

      // Check for directory
      self.hasDirectory({
         name: 'build',
         message: true
      }, function (response) {
         // Catch
         if (!response) {
            message.rocket.dir.noBuild();
            return false;
         }
         // Continue
         self.hasDirectory({
            name: 'js',
            message: false
         }, function (response) {
            // Run build
            cockpit.read(false, function (json) {
               // Catch
					if (!json) {
						return false;
					};
               if (!Rocket.is.object(json) || !Rocket.is.array(json.build)) {
                  message.rocket.build.noneSmall();
                  return false;
               }
               // Continue
               for (var i = 0, len = json.build.length; i < len; i++) {
                  // Validate
                  if (self.validate.build(json.build[i], 'js')) {
                     // Create directory
                     if (!response && !directoryMade) {
                        directoryMade = true;
                        fs.mkdir('js');
                     }
                     // Execute
                     self.jsExecute(json.build[i]);
                  }
               }
            });
         });
      });
   },
   jsExecute: function (obj) {
      // Check
      if (!Rocket.is.object(obj)) {
         return false;
      }
      // Variables
      var jsFile = '';
      var outputPath = (Rocket.exists(obj.outputPath) && Rocket.exists(obj.outputPath.js)) ? obj.outputPath.js : v.build.outputPath.js;
      var subExtension = (Rocket.exists(obj.subExtension)) ? obj.subExtension : v.build.subExtension;

      var nameFull = obj.name + subExtension + '.js';
      var filePath = path.join(outputPath, nameFull);

      // Create file data
      for (var i = 0, len = obj.js.length; i < len; i++) {
         var ext = Rocket.get.extension(obj.js[i]);
         // Clean up path
         if (obj.js[i].substring(0,3) === '../') {
            obj.js[i] = obj.js[i].replace(/(\.\.\/)/g, '');
         } else {
            obj.js[i] = 'build/js/' + obj.js[i];
         }
         // Minify
         switch (ext) {
            case 'coffee':
               var compiledCode = coffeeScript.compile(fs.readFileSync(obj.js[i], {encoding: 'utf8'}));
               js = uglify.minify(compiledCode, {fromString: true}).code;
               break;
            case 'js':
               jsFile += uglify.minify(obj.js[i], v.options.uglify).code;
               break;
         }
      }

      // Catch
      if (jsFile.length <= 0) {
         Rocket.log(colour.command('JS: ') + colour.action(nameFull + '...') + colour.error('fail (The resulting file was empty)'));
      }
      // Continue
      fs.writeFile(filePath, jsFile, function(error) {
         // Catch
         if (error) {
            Rocket.log(colour.error(error));
            return false;
         }
         // Continue
         Rocket.log(colour.command('JS: ') + colour.action(nameFull + '...') + colour.command('successful'));
      });
   },
   validate: {
      build: function (build, type) {
         if (!Rocket.is.object(build)) {
            return false
         }
         if (!Rocket.is.string(build.name)) {
            return false;
         }
         if (Rocket.is.boolean(build.run) && build.run === false) {
            return false;
         }
         switch (type) {
            case 'css':
               if (!Rocket.is.array(build.styles)) {
                  return false;
               }
               if (build.styles.length < 1) {
                  return false;
               }
               break;
            case 'js':
               if (!Rocket.is.array(build.js)) {
                  return false;
               }
               if (build.js.length < 1) {
                  return false;
               }
               break;
            default:
               return false;
         }
         return true;
      }
   }
};
