'use strict';

// Every committed .min.js must be the output of its composer "minify:js-*" script.
// Production loads the .min files (the readable ones are left out of the release zip),
// so a stale .min ships old code. Run `composer build:js` after changing JS sources.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const scripts = JSON.parse(fs.readFileSync(path.join(root, 'composer.json'), 'utf8')).scripts;
const uglify = path.join(root, 'node_modules', '.bin', 'uglifyjs');

// Split a composer script command line into arguments, honouring single quotes.
const splitArgs = (command) => (command.match(/'[^']*'|\S+/g) || []).map((arg) => arg.replace(/^'(.*)'$/, '$1'));

Object.keys(scripts)
    .filter((name) => name.indexOf('minify:js-') === 0)
    .forEach((name) => {
        test(`${name} output is up to date`, { skip: !fs.existsSync(uglify) && 'run npm install first' }, () => {
            const args = splitArgs(scripts[name]);
            assert.strictEqual(args[0], 'uglifyjs');
            const outputIndex = args.indexOf('--output');
            assert.notStrictEqual(outputIndex, -1, `${name} has no --output`);
            const output = args[outputIndex + 1];
            const cliArgs = args.slice(1, outputIndex).concat(args.slice(outputIndex + 2));

            const result = spawnSync(uglify, cliArgs, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
            assert.strictEqual(result.status, 0, result.stderr);
            const committed = fs.readFileSync(path.join(root, output), 'utf8');
            assert.ok(
                committed.trimEnd() === result.stdout.trimEnd(),
                `${output} is stale: run "composer ${name}" (or "composer build:js")`
            );
        });
    });
