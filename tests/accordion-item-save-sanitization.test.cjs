const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(
    path.join(__dirname, '..', 'assets', 'blocks', 'advaccordion', 'accordion.jsx'),
    'utf8'
);

const blockStart = source.indexOf("registerBlockType( 'advgb/accordion-item'");
const currentSaveStart = source.indexOf('save: function ( { attributes } ) {', blockStart);
const deprecatedStart = source.indexOf('deprecated: [', currentSaveStart);
const currentSave = source.slice(currentSaveStart, deprecatedStart);
const firstDeprecatedStart = source.indexOf('save: function ( { attributes } ) {', deprecatedStart);
const secondDeprecatedStart = source.indexOf('save: function ( { attributes } ) {', firstDeprecatedStart + 1);
const firstDeprecatedSave = source.slice(firstDeprecatedStart, secondDeprecatedStart);

if (currentSave.includes('!important')) {
    throw new Error('Accordion Item current save markup must not serialize !important inline styles.');
}

if (currentSave.includes('className="advgb-icon-')) {
    throw new Error('Accordion Item current save markup must not serialize SVG icon class attributes.');
}

[
    '{ HEADER_ICONS[headerIcon] }',
    '{ HEADER_ICONS_OPENED[headerIcon] }',
    "borderStyle: borderStyle",
    "borderWidth: borderWidth + 'px'",
    "borderColor: borderColor",
    "borderTop: 'none'",
    "borderRadius: !!borderRadius ? borderRadius + 'px' : undefined",
].forEach((expected) => {
    if (!currentSave.includes(expected)) {
        throw new Error(`Accordion Item current save markup is missing expected sanitized style: ${expected}`);
    }
});

[
    'className="advgb-icon-closed"',
    'className="advgb-icon-opened"',
    "borderStyle: borderStyle + ' !important'",
    "borderWidth: borderWidth + 'px !important'",
    "borderColor: borderColor + ' !important'",
    "borderTop: 'none !important'",
    "borderRadius: !!borderRadius ? borderRadius + 'px !important' : undefined",
].forEach((expected) => {
    if (!firstDeprecatedSave.includes(expected)) {
        throw new Error(`Accordion Item first deprecated save markup must preserve previous style: ${expected}`);
    }
});

console.log('Accordion Item save sanitization test passed.');
