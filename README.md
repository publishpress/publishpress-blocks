# PublishPress Blocks

## Description

PublishPress Blocks is the plugin that gives you more control over the WordPress block editor.

PublishPress Blocks has everything you need to build professional websites with WordPress. The blocks include 24 layout options, sliders, buttons, icons, image galleries, maps, tabs, testimonials, accordions, and much more.

## Documentation

https://publishpress.com/knowledge-base/installation/

## How to report bugs or send suggestions

Feel free to email us via [help@publishpress.com](mailto:help@publishpress.com). We would love to hear you, and will work hard to help you.

### Guidelines

* Write a clear summary
* Write precise steps to reproduce

## Installation

:warning: **Warning! This plugin requires to be built before being installed!**

This repository doesn't store external dependencies required by the plugin. It's not possible to simply clone or download the repository code and have a working WordPress plugin.

We aim to follow good practices on development, and we are using Composer as dependency manager, which recommends to not add external dependencies into the repository. You can find more information on their documentation page: [Should I commit the dependencies in my vendor directory?](https://getcomposer.org/doc/faqs/should-i-commit-the-dependencies-in-my-vendor-directory.md)

### How to install?

You can download a built package from [releases page](https://github.com/publishpress/Advanced-Gutenberg/releases) and install it on your WordPress sites by uploading the zip file, or upload the folder "src" renamed as "advanced-gutenberg" to plugins folder. This last option is for developers who want to contribute and/or test.

## How to contribute with code

* Clone the repository
* Create a new branch based on "develop" branch
* Implement and commit the code
* Create a Pull Request targeting the "develop" branch adding details about your fix

We will review and contact you as soon as possible.

## Development

Be sure to initialize Docker first.

1. `cd dev-workspace`
2. `./run`

### React JS and JSX Files

We use [React](https://facebook.github.io/react/) to build part of the user interface.
The sources files are named with the extension JSX. Which is optional on React, but provides a way to write modern code and compile to be compatible with legacy browsers. We use [babeljs.io](https://babeljs.io/) with the presets: react and es2015 to compile to JS files.

Please check the requirements at [our documentation page](https://publishpress.github.io/docs/development/react-jsx).

**Important:** use the npm modules from [package.json](https://github.com/publishpress/Advanced-Gutenberg/blob/master/package.json), and these two files as is that already comes within the repository: webpack.config.js and .babelrc.

#### Compiling JSX files to JS

Inside Docker run `composer build:js` or `composer build:js-dev`

#### Compiling SCSS files to CSS

Inside Docker run `composer build:css` or `composer build:css-dev`

Please note there are other commands related to CSS compilation that involves specific files from admin. For more details check all the scripts in composer.json.

#### Minify JS files

Check the commands related to JS minification in composer.json scripts. All of them uses uglifyjs.

`composer build:js` compiles the JSX and then regenerates every `.min.js` file (`composer minify:js`). Production loads the `.min.js` files and the release zip leaves out the large readable ones, so always rebuild after changing JS. `node --test tests/` fails if a `.min.js` file is stale.

#### Creating a zip installer

Inside Docker run `composer build`.

## License

License: [GPLv2 or later](http://www.gnu.org/licenses/gpl-2.0.html)
