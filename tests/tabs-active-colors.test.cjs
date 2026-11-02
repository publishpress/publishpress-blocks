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

function headers(attributes) {
    const editor = new block.edit({attributes: {...defaults, ...attributes}, clientId:'tabs', innerBlocks:[]});
    const tree = editor.render();
    assert.equal(find(tree, node => node.type === 'style'), undefined);
    const panel = find(tree, node => node.props?.className === 'advgb-tabs-panel');
    return React.Children.toArray(panel.props.children).slice(0, 3).map(item => ({
        background: item.props.style.backgroundColor,
        color: find(item, node => node.type === 'a').props.style.color
    }));
}
const colors = {headerBgColor:'#333333', headerTextColor:'#eeeeee', activeTabBgColor:'#FFEE58', activeTabTextColor:'#112233'};
for (const active of [0, 1, 2]) {
    test(`active colors follow tab ${active + 1} without a wrapper ID or stylesheet`, () => {
        const result = headers({...colors, tabActive:active, pid:undefined});
        result.forEach((item, index) => {
            assert.equal(item.background, index === active ? colors.activeTabBgColor : colors.headerBgColor);
            assert.equal(item.color, index === active ? colors.activeTabTextColor : colors.headerTextColor);
        });
    });
}
test('clearing active colors restores the normal header colors', () => {
    const result = headers({...colors, tabActive:1, activeTabBgColor:undefined, activeTabTextColor:''});
    assert.deepEqual(result[1], {background:colors.headerBgColor, color:colors.headerTextColor});
});
test('changing one active color preserves the other header fallback', () => {
    const result = headers({...colors, tabActive:0, activeTabTextColor:undefined});
    assert.deepEqual(result[0], {background:colors.activeTabBgColor, color:colors.headerTextColor});
});
test('a sidebar color update appears on the next render', () => {
    assert.equal(headers({...colors, tabActive:0})[0].background, '#FFEE58');
    assert.equal(headers({...colors, tabActive:0, activeTabBgColor:'#ff0000'})[0].background, '#ff0000');
});

test('active CSS resolves the editor variables even with important defaults', () => {
    const attributes = {...defaults, ...colors, tabActive:0};
    const editor = new block.edit({attributes, clientId:'tabs', innerBlocks:[]});
    const panel = find(editor.render(), node => node.props?.className === 'advgb-tabs-panel');
    const first = React.Children.toArray(panel.props.children)[0];
    assert.equal(first.props.style['--advgb-active-tab-bg'], colors.activeTabBgColor);
    assert.equal(first.props.style['--advgb-active-tab-color'], colors.activeTabTextColor);
    const css = fs.readFileSync(path.join(__dirname, '../assets/css/blocks.css'), 'utf8');
    assert.match(css, /background-color:var\(--advgb-active-tab-bg,\s*#5954d6\)\s*!important/);
    assert.match(css, /color:var\(--advgb-active-tab-color,\s*#fff\)\s*!important/);
});
