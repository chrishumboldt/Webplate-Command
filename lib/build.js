/**
 * Author: Chris Humboldt
**/

// Requires
var cache = require('./cache');
var colour = require('./colour');
var coffeeScript = require('coffee-script');
var cockpit = require('./cockpit');
var cssmin = require('cssmin');
var directory = require('./directory');
var fs = require('fs');
var message = require('./message');
var path = require('path');
var Rocket = require('rocket-tools');
var sassify = require('node-sass');
var uglify = require('uglify-js');
var walker = require('dir-at-st');

var v = require('./variable');

module.exports = {
   execute: {
      css: function (obj, buildRoot) {
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

         var renderData = (v.dirName() === 'rocket') ? '@import "engine/build/sass/import.scss";' : '';
         for (var i = 0, len = obj.css.length; i < len; i++) {
            var file = obj.css[i];
            var ext = Rocket.get.extension(file);

            switch (ext) {
               case 'scss':
                  if (file.substring(0,6) === '../../') {
                     renderData += '@import "' + file.replace(/(\.\.\/)/g, '') + '";';
                  } else {
                     renderData += '@import "' + buildRoot + '/sass/' + file + '";';
                  }
                  renderData = renderData.replace(/(\.scss)/g, '');
                  break;
               default:
                  renderData += fs.readFileSync(path.join(buildRoot, 'css', file), 'utf8');
            }
         }
         var fileData = sassify.renderSync({
            data: renderData,
            outputStyle: 'compressed'
         }).css.toString();

         // Write file
         // Catch
         if (fileData.length <= 0) {
            Rocket.log(colour.command('CSS: ') + colour.action(nameFull + '...') + colour.error('fail (The resulting file was empty)'));
         }
         // Continue
         var minified = cssmin(fileData);
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
      js: function (obj, buildRoot) {
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
            obj.js[i] = buildRoot + '/js/' + obj.js[i];
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
      }
   },
   getCockpit: function (callback) {
      // Catch
      if (!Rocket.is.function(callback)) {
         return false;
      }
      // Continue
      cockpit.read(function (json) {
         // Catch
         if (!json || !Rocket.is.object(json) || !Rocket.is.array(json.build)) {
            return false;
         }
         // Continue
         var buildRoot = (Rocket.is.string(json.buildRoot)) ? json.buildRoot : v.build.root;
         directory.exists(buildRoot, function (response) {
            if (response) {
               return callback(json);
            }
         });
      });
   },
   init: function (type) {
      var self = this;
      self.getCockpit(function (json) {
         switch (type) {
            case 'css':
               self.process(json, 'css');
               break;
            case 'js':
               self.process(json, 'js');
               break;
            default:
               message.rocket.build.all();
               self.process(json, 'css');
               self.process(json, 'js');
         }
         // Bust cache
         if (v.dirName() === 'rocket') {
            cache.bust(false);
         }
      });
   },
   process: function (json, type) {
      // Catch
      if (!Rocket.is.json(json) || !Rocket.is.string(type)) {
         return false;
      }
      // Continue
      var self = this;
      var buildRoot = (Rocket.is.string(json.buildRoot)) ? json.buildRoot : v.build.root;

      // Functions
      function checkType(type) {
         // Catch
         if (!Rocket.is.string(type)) {
            return false;
         }
         // Continue
         for (var i = 0, len = json.build.length; i < len; i++) {
            // Validate
            if (self.validate.build(json.build[i], type)) {
               return true;
               break;
            }
         }
         return false;
      }

      // Create directory
      if (checkType(type)) {
         directory.create(type, function () {
            for (var i = 0, len = json.build.length; i < len; i++) {
               // Validate
               if (self.validate.build(json.build[i], type)) {
                  // Execute
                  switch (type) {
                     case 'js':
                        self.execute.js(json.build[i], buildRoot);
                        break;
                     case 'css':
                        self.execute.css(json.build[i], buildRoot);
                        break;
                  }
               }
            }
         });
      }
   },
   validate: {
      build: function (build, type) {
         if (!Rocket.is.object(build)) {
            return false;
         }
         if (!Rocket.is.string(build.name)) {
            return false;
         }
         if (Rocket.is.boolean(build.run) && build.run === false) {
            return false;
         }
         switch (type) {
            case 'css':
               if (!Rocket.is.array(build.css)) {
                  return false;
               }
               if (build.css.length < 1) {
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
