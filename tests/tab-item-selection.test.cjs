const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { test } = require('node:test');
const babel = require('@babel/core');
const React = require('react');
function setup(order = ['tab-a', 'tab-b', 'tab-c']) {
    let config, dispatchFactory;
    const calls = [];
    const selector = () => ({ getBlockOrder: () => order });
    const dispatcher = () => ({ selectBlock: (...args) => calls.push(['select', ...args]), updateBlockAttributes: (...args) => calls.push(['update', ...args]) });
    const wp = {
        i18n: { __: text => text }, element: React,
        blockEditor: new Proxy({}, {get: (_, name) => name}),
        components: new Proxy({}, {get: (_, name) => name}),
        blocks: { registerBlockType: (name, settings) => { config = settings; } },
        data: { select: selector, dispatch: dispatcher, withSelect: () => x => x, withDispatch: fn => { dispatchFactory = fn; return x => x; } },
        compose: { compose: () => x => x }
    };
    const source = fs.readFileSync(path.join(__dirname, '../assets/blocks/advtabs/block.jsx'), 'utf8');
    const code = babel.transformSync(source, { babelrc: false, configFile: false, presets: ['@babel/preset-react'] }).code;
    vm.runInNewContext(code, { wp, React, lodash: { times: (n, fn) => Array.from({length:n}, (_, i) => fn(i)) }, advgbBlocks: {advgb_pro:'0'} });
    const innerBlocks = order.map(clientId => ({clientId}));
    const actions = dispatchFactory(dispatcher, {clientId:'parent', innerBlocks}, {select:selector});
    const attributes = Object.fromEntries(Object.entries(config.attributes).map(([key, value]) => [key, value.default]));
    const component = new config.edit({attributes, clientId:'parent', innerBlocks, ...actions});
    return {component, actions, calls, order};
}
function find(node, predicate) {
    if (!node || typeof node !== 'object') return;
    if (predicate(node)) return node;
    for (const child of React.Children.toArray(node.props?.children)) {
        const match = find(child, predicate);
        if (match) return match;
    }
}
test('clicking Tab 2 activates it and selects its child without moving the caret', () => {
    const {component, calls} = setup();
    const tree = component.render();
    const panel = find(tree, node => node.props?.className === 'advgb-tabs-panel');
    const second = React.Children.toArray(panel.props.children)[1];
    const header = find(second, node => node.type === 'a');
    let stopped = false;
    header.props.onClick({stopPropagation() { stopped = true; }});
    assert.equal(stopped, true);
    assert.deepEqual(calls.filter(c => c[0] === 'select'), [['select', 'tab-b', null]]);
    for (const id of ['parent', 'tab-a', 'tab-b', 'tab-c']) {
        assert.ok(calls.some(c => c[0] === 'update' && c[1] === id && c[2].tabActive === 1));
    }
});
test('selection follows the current order after tabs are moved', () => {
    const {actions, calls, order} = setup();
    order.reverse();
    actions.selectTab(0);
    assert.deepEqual(calls, [['select', 'tab-c', null]]);
});
test('a missing tab does not clear editor selection', () => {
    const {actions, calls} = setup([]);
    actions.selectTab(0);
    assert.deepEqual(calls, []);
});
test('programmatic activation does not steal selection', () => {
    const {actions, calls} = setup();
    actions.updateTabActive(1);
    assert.equal(calls.some(c => c[0] === 'select'), false);
});
