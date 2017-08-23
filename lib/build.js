/**
@author Chris Humboldt
**/

'use strict';

// Requires
const babel = require('babel-core');
const cache = require('./cache');
const colour = require('./colour');
const cockpit = require('./cockpit');
const cssmin = require('cssmin');
const directory = require('./directory');
const fs = require('fs');
const message = require('./message');
const path = require('path');
const Rocket = require('rocket-tools');
const rollup = require('rollup');
const sassify = require('node-sass');
const uglify = require('uglify-js');
const walker = require('dir-at-st');

const _var = require('./variable');

module.exports = {
   execute: {
      css: function (obj, buildRoot) {
         if (!Rocket.is.object(obj)) return false;

         // Variables
         const outputPath = (Rocket.exists(obj.outputPath) && Rocket.exists(obj.outputPath.css)) ? obj.outputPath.css : _var.build.outputPath.css;
         const subExtension = (Rocket.exists(obj.subExtension)) ? obj.subExtension : _var.build.subExtension;
         const nameFull = obj.name + subExtension + '.css';

         let fileData = '';
         const fileOutputPath = path.join(outputPath, nameFull);
         let renderData = (_var.dirName() === 'rocket') ? '@import "engine/build/sass/import.scss";' : '';

         for (let i = 0, len = obj.css.length; i < len; i++) {
            const file = obj.css[i];
            const ext = Rocket.get.extension(file);

            switch (ext) {
               case 'scss':
                  if (file.substring(0, 2) === '~/') {
                     renderData += '@import "' + buildRoot + '/sass/' + file.replace(/~\//g, '') + '";';
                  } else {
                     renderData += '@import "' + file + '";';
                  }
                  renderData = renderData.replace(/(\.scss)/g, '');
                  break;

               case 'css':
                  if (file.substring(0, 2) === '~/') {
                     renderData += fs.readFileSync(path.join(buildRoot, 'css', file.replace(/~\//g, '')), 'utf8');
                  } else {
                     var arPaths = file.split('/');
                     var filePath = '';
                     for (var i2 = 0, len2 = arPaths.length; i2 < len2; i2++) {
                        filePath = path.join(filePath, arPaths[i2]);
                     }
                     renderData += fs.readFileSync(filePath, 'utf8');
                  }
            }
         }

         fileData = sassify.renderSync({ data: renderData, outputStyle: 'compressed' }).css.toString();

         // Write file
         if (fileData.length <= 0) {
            Rocket.log(colour.command('CSS: ') + colour.action(nameFull + '...') + colour.error('fail (The resulting file was empty)'));
         }

         // Continue
         const minified = cssmin(fileData);
         fs.writeFile(fileOutputPath, minified, function(error) {
            if (error) {
               Rocket.log(colour.error(error));
               return false;
            }

            // Continue
            Rocket.log(colour.command('CSS: ') + colour.action(nameFull + '...') + colour.command('successful'));
         });
      },
      js: function (obj, buildRoot) {
         if (!Rocket.is.object(obj)) return false;

         // Variables
         let jsFile = '';
         const outputPath = (Rocket.exists(obj.outputPath) && Rocket.exists(obj.outputPath.js)) ? obj.outputPath.js : _var.build.outputPath.js;
         const subExtension = (Rocket.exists(obj.subExtension)) ? obj.subExtension : _var.build.subExtension;
         const nameFull = obj.name + subExtension + '.js';

         function writeFile(jsFile) {
            if (jsFile.length <= 0) {
               Rocket.log(colour.command('JS: ') + colour.action(nameFull + '...') + colour.error('fail (The resulting file was empty)'));
               return;
            }

            fs.writeFile(path.join(outputPath, nameFull), jsFile, (error) => {
               if (error) {
                  Rocket.log(colour.error(error));
                  return false;
               }
               Rocket.log(colour.command('JS: ') + colour.action(nameFull + '...') + colour.command('successful'));
            });
         }

         // JS only
         if (obj.js) {
            // Create file data
            for (let i = 0, len = obj.js.length; i < len; i++) {
               const ext = Rocket.get.extension(obj.js[i]);

               // Clean up path and get file contents
               if (obj.js[i].substring(0, 2) === '~/') {
                  obj.js[i] = buildRoot + '/js/' + obj.js[i].replace(/~\//g, '');
               }
               const fileContents = fs.readFileSync(obj.js[i], {encoding: 'utf8'})

               // Transform and minify
               switch (ext) {
                  case 'js':
                     if (/.min.js$/.test(obj.js[i])) {
                        jsFile += fileContents;
                     } else {
                        jsFile += uglify.minify(babel.transform(fileContents, _var.options.babel).code, _var.options.uglify).code;
                     }
                     break;

                  case 'jsx':
                     jsFile += uglify.minify(babel.transform(fileContents, _var.options.babel).code, _var.options.uglify).code;
                     break;
               }
            }

            writeFile(jsFile);
         }

         // Module bundle
         if (obj.bundle) {
            if (obj.bundle.substring(0, 2) === '~/') {
               obj.bundle = buildRoot + '/js/' + obj.bundle.replace(/~\//g, '');
            }

            const bundle = rollup.rollup({
               input: obj.bundle
            }).then((resp) => {
               const bundleCode = resp.generate({
                  format: 'es'
               }).then((resp) => {
                  writeFile(uglify.minify(babel.transform(resp.code, _var.options.babel).code, _var.options.uglify).code);
               });
            });
         }
      }
   },
   getCockpit: function (callback) {
      if (!Rocket.is.function(callback)) return false;

      // Continue
      cockpit.read((json) => {
         if (!json || !Rocket.is.object(json) || !Rocket.is.array(json.build)) return false;

         // Continue
         const buildRoot = (Rocket.is.string(json.buildRoot)) ? json.buildRoot : _var.build.root;
         directory.exists(buildRoot, (resp) => {
            if (resp) return callback(json);
         });
      });
   },
   init: function (type) {
      const self = this;

      self.getCockpit((json) => {
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
         if (_var.dirName() === 'rocket') cache.bust(false);
      });
   },
   process: function (json, type) {
      if (!Rocket.is.json(json) || !Rocket.is.string(type)) return false;

      // Continue
      const self = this;
      const buildRoot = (Rocket.is.string(json.buildRoot)) ? json.buildRoot : _var.build.root;

      // Functions
      function checkType(type) {
         if (!Rocket.is.string(type)) return false;

         // Continue
         for (let i = 0, len = json.build.length; i < len; i++) {
            if (self.validate.build(json.build[i], type)) {
               return true;
               break;
            }
         }
         return false;
      }

      // Create directory
      if (checkType(type)) {
         directory.create(type, () => {
            for (let i = 0, len = json.build.length; i < len; i++) {
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
         if (!Rocket.is.object(build)) return false;
         if (!Rocket.is.string(build.name)) return false;
         if (Rocket.is.boolean(build.run) && build.run === false) return false;

         switch (type) {
            case 'css':
               if (!Rocket.is.array(build.css)) return false;
               if (build.css.length < 1) return false;
               break;

            case 'js':
               if (build.js && build.bundle) {
                  Rocket.log(colour.command('JS: ') + colour.error('You have a JS and bundle property conflict'));
                  return false;
               }
               if (!Rocket.is.array(build.js) && !Rocket.is.string(build.bundle)) return false;
               if (build.js && build.js.length < 1) return false;
               if (build.bundle && build.bundle.length < 1) return false;
               break;

            default:
               return false;
         }

         return true;
      }
   }
};
