const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const babel = require('@babel/core');
const React = require('react');
const file = path.join(__dirname, '../assets/blocks/advtabs/block.jsx');
function load(source) {
    let block;
    const stub = () => null;
    stub.Content = () => null;
    const wp = {
        i18n: {__: text => text}, element: React,
        blockEditor: new Proxy({}, {get: () => stub}),
        components: new Proxy({}, {get: () => stub}),
        blocks: {registerBlockType(name, settings) {block = settings;}},
        data: {withSelect: () => x => x, withDispatch: () => x => x},
        compose: {compose: () => x => x}
    };
    const code = babel.transformSync(source, {babelrc: false, configFile: false, presets: ['@babel/preset-react']}).code;
    vm.runInNewContext(code, {wp, React, lodash: {}, advgbBlocks: {advgb_pro:'0'}});
    return block;
}
const block = load(fs.readFileSync(file, 'utf8'));
const defaults = Object.fromEntries(Object.entries(block.attributes).map(([key, value]) => [key, value.default]));
function find(node, predicate) {
    if (!node || typeof node !== 'object') return;
    if (predicate(node)) return node;
    for (const child of React.Children.toArray(node.props?.children)) {
        const match = find(child, predicate);
        if (match) return match;
    }
}
test('Tabs offers native wide and full alignment without changing the default', () => {
    assert.deepEqual(Array.from(block.supports.align), ['wide', 'full']);
    assert.equal(block.attributes.align?.default, undefined);
});
for (const align of [undefined, 'wide', 'full']) {
    test(`editor and saved wrappers agree for ${align || 'default'} width`, () => {
        const attributes = {...defaults, align};
        const editor = new block.edit({attributes, clientId:'tabs', innerBlocks:[]});
        const wrapper = find(editor.render(), node => typeof node.props?.className === 'string' && node.props.className.split(' ').includes('advgb-tabs-wrapper'));
        const saved = block.save({attributes});
        for (const element of [wrapper, saved]) {
            assert.ok(element);
            assert.equal(element.props.className.split(' ').includes(`align${align}`), !!align);
            assert.equal(element.props.style?.width, undefined);
        }
    });
}
test('unaligned saved output matches the pre-fix fixture', () => {
    const {renderToStaticMarkup} = require('react-dom/server');
    const fixture = fs.readFileSync(path.join(__dirname, 'tabs-default-width.html'), 'utf8').trim();
    assert.equal(renderToStaticMarkup(block.save({attributes:defaults})), fixture);
});
if (process.env.GENERATE_TABS_WIDTH_FIXTURE === '1') {
    const old = load(require('node:child_process').execFileSync('git', ['show', 'HEAD:assets/blocks/advtabs/block.jsx'], {cwd:path.join(__dirname, '..'), encoding:'utf8'}));
    fs.writeFileSync(path.join(__dirname, 'tabs-default-width.html'), require('react-dom/server').renderToStaticMarkup(old.save({attributes:defaults})) + '\n');
}
