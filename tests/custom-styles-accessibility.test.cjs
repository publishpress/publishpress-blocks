const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/js/custom-styles.js'), 'utf8');

function setup({ next = true, previous = true, focused = true, confirmDelete = true } = {}) {
    const handlers = {};
    const state = { focused: null, removed: false };
    const target = name => ({ length: 1, first() { return this; }, children() { return this; }, trigger() { state.focused = name; } });
    const empty = { length: 0, first() { return this; } };
    const item = {
        0: { contains() { return focused; } },
        data() { return 7; },
        nextAll() { return next ? target('next') : empty; },
        prevAll() { return previous ? target('previous') : empty; },
        remove() { state.removed = true; },
        after(html) { state.html = html; }
    };
    const link = { parent() { return item; }, prev() { return this; }, text() { return 'Example'; } };
    function $(selector) {
        if (selector === link) return link;
        return {
            ...target('add'),
            ready() {}, off() { return this; },
            on(event, handler) { handlers[selector] = handler; },
            val() { return 'nonce'; }, prepend(html) { state.html = html; }
        };
    }
    const context = {
        jQuery: $, document: {}, confirm: () => confirmDelete,
        window: { advgbCustomStyles: { copyLabel: 'Copier &quot;style&quot;', deleteLabel: 'Supprimer' } }
    };
    vm.createContext(context);
    vm.runInContext(source + '\nthis.Manager = AdvGbCustomStyles;', context);
    const manager = Object.create(context.Manager.prototype);
    Object.assign(manager, { $, styleId: 7, ajaxRequest(data, callbacks) { state.request = data; state.callbacks = callbacks; }, customStylePreview() {}, initCustomStyleMenu() {} });
    return { manager, handlers, state, link };
}
const event = { preventDefault() {}, stopPropagation() {} };
for (const [name, options, expected] of [
    ['next style', {}, 'next'],
    ['previous style', { next: false }, 'previous'],
    ['empty list', { next: false, previous: false }, 'add'],
    ['focus moved elsewhere', { focused: false }, null]
]) {
    test(`deletion: ${name}`, () => {
        const { manager, handlers, state, link } = setup(options);
        manager.initCustomStyleDelete();
        handlers['#mybootstrap .advgb-customstyles-items a.trash'].call(link, event);
        assert.equal(state.removed, false);
        assert.equal(state.focused, null);
        state.callbacks.success({ id: 7 });
        assert.equal(state.removed, true);
        assert.equal(state.focused, expected);
    });
}
test('cancelled deletion leaves the item and focus alone', () => {
    const { manager, handlers, state, link } = setup({ confirmDelete: false });
    manager.initCustomStyleDelete();
    handlers['#mybootstrap .advgb-customstyles-items a.trash'].call(link, event);
    assert.equal(state.request, undefined);
    assert.equal(state.removed, false);
    assert.equal(state.focused, null);
});
for (const action of ['New', 'Copy']) {
    test(`${action} uses localized titles and accessible names`, () => {
        const { manager, handlers, state, link } = setup();
        manager[`initCustomStyle${action}`]();
        const selector = action === 'New' ? '.advgb-customstyles-new' : '#mybootstrap .advgb-customstyles-items a.copy';
        handlers[selector].call(link, event);
        state.callbacks.success({ id: 8, title: 'Example', name: 'example', identifyColor: '#fff' });
        assert.ok(state.html.includes('title="Copier &quot;style&quot;" aria-label="Copier &quot;style&quot;"'));
        assert.ok(state.html.includes('title="Supprimer" aria-label="Supprimer"'));
    });
}
