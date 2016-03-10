#!/usr/bin/env node

/**
 * File: index.js
 * Type: Javascript index file
 * Author: Chris Humboldt
 */

'use strict';

// Table of contents
// Requires
// Variables
// Setup console colours
// Functions
// Execute

// Requires
var chalk = require('chalk');
var fs = require('fs');
var sass = require('node-sass');
var shell = require('shelljs');
var uglify = require('uglify-js');

// Variables
var $arguments = process.argv.slice(2);
var $command = $arguments[0];
var $config;
var $currentPath = process.cwd();
var $html = '';
var $optionsUglify = {
    mangle: true,
    compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
    }
};
var $path = {
    engine: {
        root: './engine/',
        component: './engine/component/',
        css: './engine/css/',
        js: './engine/js/',
        jsSrc: './engine/js/src/',
        sass: './engine/sass/'
    },
    project: {
        root: './project/',
        component: './project/component/',
        css: './project/css/',
        sass: './project/sass/',
    }
};

var $dirName = ($currentPath).substr($currentPath.lastIndexOf('/') + 1);
var $jsFilesEngineScripts = [
    $path.engine.jsSrc + 'modernizr.js',
    $path.engine.jsSrc + 'velocity.js',
    $path.engine.component + 'buttonplate/js/buttonplate.js',
    $path.engine.component + 'flickerplate/js/flickerplate.js',
    $path.engine.component + 'formplate/js/formplate.js',
    $path.engine.component + 'injectplate/js/injectplate.js',
    $path.engine.component + 'loaderplate/js/loaderplate.js',
    $path.engine.component + 'menuplate/js/menuplate.js',
    $path.engine.component + 'messageplate/js/messageplate.js',
    $path.engine.component + 'modalplate/js/modalplate.js',
    $path.engine.component + 'tabplate/js/tabplate.js',
    $path.engine.jsSrc + 'tools.js',
    $path.engine.jsSrc + 'overwrite.js'
];
var $jsFilesEngineStart = [
    $path.engine.jsSrc + 'core.js'
];
var $jsFilesEngineTouch = [
    $path.engine.jsSrc + 'fastclick.js'
];

// Setup console colours
var chalkAction = chalk.cyan;
var chalkCommand = chalk.magenta;
var chalkError = chalk.red;
var chalkText = chalk.green;
var chalkTitle = chalk.yellow;
var chalkNumber = chalk.yellow;
var chalkOption = chalk.cyan;
var chalkWarning = chalk.yellow;

// Functions
var buildCSS = function() {
    console.log(chalkAction('Building your CSS...'));
    // Engine CSS
    sass.render({
        file: './engine/sass/styles.scss',
        outputStyle: 'compressed'
    }, function($error, $result) {
        if ($error) {
            console.log(chalkError($error.message));
        } else {
            var $css = $result.css.toString();
            fs.writeFile($path.engine.css + 'styles.min.css', $css, function($error) {
                if ($error) {
                    console.log(chalkError($error));
                } else {
                    console.log(chalkNumber('CSS: ') + chalkAction('engine/styles.min.css...') + chalkAction.bold('successful'));
                }
            });
        }
    });
    // Project CSS
    if ($config.build) {
        for (var $i = 0, $len = $config.build.length; $i < $len; $i++) {
            var $build = $config.build[$i];
            var $projectSASS = [$path.engine.sass + 'import.scss'];
            var $fileData = '';
            // Components
            if ($build.component) {
                for (var $i2 = 0, $len2 = $build.component.length; $i2 < $len2; $i2++) {
                    try {
                        var $data = fs.readFileSync($path.project.component + $build.component[$i2] + '/.bower.json');
                        var $bower = JSON.parse($data);
                        if (typeof $bower.main == 'object') {
                            for (var $i3 = 0, $len3 = $bower.main.length; $i3 < $len3; $i3++) {
                                if ($bower.main[$i3].indexOf('.css') > -1 || $bower.main[$i3].indexOf('.scss') > -1) {
                                    $projectSASS.push($path.project.component + $build.component[$i2] + '/' + $bower.main[$i3]);
                                }
                            }
                        } else {
                            if ($bower.main.indexOf('.css') > -1 || $bower.main.indexOf('.scss') > -1) {
                                $projectSASS.push($path.project.component + $build.component[$i2] + '/' + $bower.main);
                            }
                        }
                    } catch ($error) {
                        console.log(chalkError($error));
                    }
                }
            }
            // SASS
            if ($build.sass) {
                for (var $i2 = 0, $len2 = $build.sass.length; $i2 < $len2; $i2++) {
                    $projectSASS.push($path.project.sass + $build.sass[$i2]);
                }
            }
            // console.log($projectSASS);
            for (var $i2 = 0, $len2 = $projectSASS.length; $i2 < $len2; $i2++) {
                var $data = fs.readFileSync($projectSASS[$i2]).toString();
                if ($projectSASS[$i2] == ($path.engine.sass + 'import.scss')) {
                    $fileData += $data.replace(new RegExp('@import "', 'g'), '@import "./engine/sass/');
                } else if ($projectSASS[$i2].indexOf('.scss') > -1) {
                    if ($projectSASS[$i2].indexOf('component') > -1) {
                        $fileData += $data.replace(new RegExp('@import "', 'g'), '@import "./project/component/');
                    } else {
                        $fileData += $data.replace(new RegExp('@import "', 'g'), '@import "./project/sass/');
                    }
                } else {
                    $fileData += $data;
                }
            }
            // console.log($fileData);
            // console.log($fileData);
            sass.render({
                data: $fileData,
                outputStyle: 'compressed'
            }, function($error, $result) {
                if ($error) {
                    console.log(chalkError($error.message));
                } else {
                    var $css = $result.css.toString();
                    fs.writeFile($path.project.css + $build.name + '.min.css', $css, function($error) {
                        if ($error) {
                            console.log(chalkError($error));
                        } else {
                            console.log(chalkNumber('CSS: ') + chalkAction('project/' + $build.name + '.min.css...') + chalkAction.bold('successful'));
                        }
                    });
                }
            });
        }
    }
};
var buildJS = function() {
    console.log(chalkAction('Building your JS...'));
    // Engine scripts
    var $engineScriptJS = uglify.minify($jsFilesEngineScripts, $optionsUglify);
    fs.writeFile($path.engine.js + 'scripts.min.js', $engineScriptJS.code, function($error) {
        if ($error) {
            console.log(chalkError($error));
        } else {
            console.log(chalkNumber('JS: ') + chalkAction('engine/scripts.min.js...') + chalkAction.bold('successful'));
        }
    });
    // Engine start
    var $engineStartJS = uglify.minify($jsFilesEngineStart, $optionsUglify);
    fs.writeFile('./start.js', $engineStartJS.code, function($error) {
        if ($error) {
            console.log(chalkError($error));
        } else {
            console.log(chalkNumber('JS: ') + chalkAction('start.js...') + chalkAction.bold('successful'));
        }
    });
    // Engine touch
    var $engineTouchJS = uglify.minify($jsFilesEngineTouch, $optionsUglify);
    fs.writeFile($path.engine.js + 'JS - touch.min.js', $engineTouchJS.code, function($error) {
        if ($error) {
            console.log(chalkError($error));
        } else {
            console.log(chalkNumber('JS: ') + chalkAction('engine/touch.min.js...') + chalkAction.bold('successful'));
        }
    });
};

// Execute
if ($dirName !== 'webplate') {
    console.log('');
    console.log(chalkWarning.bold('Warning:') + chalkWarning(' You are not in a webplate directory.'));
    console.log(chalkAction('All webplate commands need to be run from it.'));
    console.log('');
} else {
    // Read config file first
    var $configFile = fs.readFileSync($path.project.root + 'config.json');
    $config = JSON.parse($configFile);

    // Commands
    switch ($command) {

        case 'build':
            if ($arguments[1] === 'css') {
                buildCSS();
            } else if ($arguments[1] === 'js') {
                buildJS();
            } else {
                buildCSS();
                buildJS();
            }
            break;

        case 'component':
            break;

        case 'create':
            break;

        case 'download':
            break;

        case 'watch':
            break;

        default:
            console.log('');
            console.log(chalkTitle('So what command do you want run?'));
            console.log('');
            console.log(chalkNumber('1)') + chalkCommand(' build'));
            console.log(chalkText('Build your project CSS and Javascript.'));
            console.log('');
            console.log(chalkNumber('2)') + chalkCommand(' build ') + chalkOption('<css|js>'));
            console.log(chalkText('Build your project CSS or Javascript.'));
            console.log('');
            console.log(chalkNumber('3)') + chalkCommand(' create ') + chalkOption('<project_name> <version|tag|optional>'));
            console.log(chalkText('Create a new project with a fresh copy of Webplate and a starter index.html file.'));
            console.log('');
            console.log(chalkNumber('4)') + chalkCommand(' component add ') + chalkOption('<bower_component>'));
            console.log(chalkText('Install a new Bower component of your choice. Bower is really awesome!'));
            console.log('');
            console.log(chalkNumber('5)') + chalkCommand(' download ') + chalkOption('<version|tag|optional>'));
            console.log(chalkText('Download a crisp new copy of Webplate in the current directory.'));
            console.log('');
            console.log(chalkNumber('6)') + chalkCommand(' watch'));
            console.log(chalkText('Run the project watcher to watch for file changes. Any change will rebuild your CSS and Javascript and perform a live reload (if installed).'));
            console.log('');
            break;
    }
}