const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

// The bundled Colorbox must take its options only from the plugin's scripts.
const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'jquery.colorbox.min.js'), 'utf8');

test('Colorbox does not read options from data-cbox-* attributes', () => {
    assert.ok(!source.includes('"data-cbox-"'), 'Settings must not look up data-cbox-<option> attributes');
    assert.ok(!source.includes('cbox-img-attrs'), 'Images must not take attributes from data-cbox-img-attrs');
});

test('Colorbox only opens and groups elements set up by the plugin', () => {
    assert.ok(source.includes('function ta(n){var h;if(!S&&t.data(n,O)){'), 'launch requires options set by code');
    assert.ok(source.includes('return!!e&&new Y(this,e).get("rel")===u'), 'groups only include elements set up by code');
});
