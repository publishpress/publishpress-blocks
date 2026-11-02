const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

for (const filename of ['main.js', 'main.min.js']) {
    test(`${filename}: native checkbox changes save and recover from failure`, () => {
        const bindings = new Map();
        const requests = [];
        const slider = { css() { return this; } };
        const checkbox = {
            checked: true, disabled: false,
            prop(key, value) {
                if (arguments.length === 1) return this[key];
                this[key] = value;
                return this;
            },
            is() { return this.checked; },
            data() { return 'enable_block_access'; },
            parent() { return { find() { return slider; } }; }
        };
        const empty = { length: 0, find() { return this; } };
        function $(selector) {
            if (selector === checkbox) return checkbox;
            return { ...empty, bind(event, handler) { bindings.set(selector + ':' + event, handler); } };
        }
        $.expr = { ':': {}, createPseudo(fn) { return fn; } };
        $.ajax = options => { requests.push(options); options.beforeSend(); };
        const context = {
            jQuery: $, wp: { i18n: {} }, console: { error() {} },
            advgb_main_dashboard: { ajaxurl: '/ajax', nonce: 'test-nonce' },
            setTimeout() {}, window: {}, document: {}
        };
        vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/js', filename), 'utf8'), context);
        const handler = bindings.get('.advgb-feature-setting input[type="checkbox"]:change');
        assert.equal(typeof handler, 'function');
        assert.equal(bindings.has('.advgb-feature-setting .slider:click'), false);
        handler.call(checkbox);
        assert.equal(requests.length, 1);
        assert.equal(requests[0].data.action, 'advgb_feature_save');
        assert.equal(requests[0].data.new_state, 1);
        assert.equal(checkbox.disabled, true);
        handler.call(checkbox);
        assert.equal(requests.length, 1);
        requests[0].success();
        requests[0].complete();
        assert.equal(checkbox.checked, true);
        assert.equal(checkbox.disabled, false);
        checkbox.checked = false;
        handler.call(checkbox);
        assert.equal(requests[1].data.new_state, 0);
        requests[1].error({ responseText: 'Save failed' });
        requests[1].complete();
        assert.equal(checkbox.checked, true);
        assert.equal(checkbox.disabled, false);
    });
}
