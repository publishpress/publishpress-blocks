const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const babel = require('@babel/core');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.join(__dirname, '..');
function load(source) {
    let block;
    const wp = {
        i18n: { __: text => text }, blocks: { registerBlockType(name, settings) { block = settings; } },
        element: React, blockEditor: {}, components: {}
    };
    const code = babel.transformSync(source.replace(/^import .*;\r?\n/gm, ''), {
        babelrc: false, configFile: false, presets: ['@babel/preset-react']
    }).code;
    vm.runInNewContext(code, { wp, React, advgbBlocks: { home_url: 'https://example.org/' } });
    return block;
}
const fixturePath = path.join(__dirname, 'public-form-serialization.json');
if (process.env.GENERATE_FORM_FIXTURES === '1') {
    const fixtures = [];
    for (const name of ['contact-form', 'newsletter', 'search-bar']) {
        const source = require('node:child_process').execFileSync('git', ['show', `ea0aa3bb^:assets/blocks/${name}/block.jsx`], { cwd: root, encoding: 'utf8' });
        const block = load(source);
        const defaults = Object.fromEntries(Object.entries(block.attributes).map(([key, value]) => [key, value.default]));
        const variants = [{}, { nameLabel: 'Your name', emailLabel: 'Your email', messageLabel: 'Your message', fnameLabel: 'Given name', lnameLabel: 'Family name', searchPlaceholder: 'Find articles', searchButtonEnabled: true, searchButtonOnLeft: true, searchIconOnRight: true, searchButtonText: 'Find', searchBtnId: 'search-test', formStyle: 'alt', formWidth: 500 }];
        for (const [version, serializer] of [block, ...(block.deprecated || [])].entries()) {
            for (const overrides of variants) {
                const props = { attributes: { ...defaults, ...overrides }, className: 'test-custom-class' };
                fixtures.push({ name, version, props, html: renderToStaticMarkup(serializer.save(props)) });
            }
        }
    }
    fs.writeFileSync(fixturePath, JSON.stringify(fixtures, null, 2) + '\n');
}
for (const [index, fixture] of JSON.parse(fs.readFileSync(fixturePath, 'utf8')).entries()) {
    test(`${fixture.name} historical format ${fixture.version}, case ${index}`, () => {
        const block = load(fs.readFileSync(path.join(root, `assets/blocks/${fixture.name}/block.jsx`), 'utf8'));
        assert.equal(renderToStaticMarkup(block.deprecated[fixture.version].save(fixture.props)), fixture.html);
        const current = renderToStaticMarkup(block.save(fixture.props));
        assert.match(current, /aria-label=/);
        assert.doesNotMatch(fixture.html, /aria-label=/);
    });
}
