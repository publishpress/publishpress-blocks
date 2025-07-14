// assets/blocks/pro-ad/shared/index.jsx

// WordPress dependencies
export const { __ } = wp.i18n;
export const { addFilter } = wp.hooks;
export const { Fragment } = wp.element;
export const { createHigherOrderComponent } = wp.compose;
export const { sprintf } = wp.i18n;

// Block Editor components
const wpBlockEditor = wp.blockEditor || wp.editor;
export const { InspectorControls, ColorPalette, BlockControls, AlignmentToolbar } = wpBlockEditor;

// WordPress components
export const { PanelBody, SelectControl, ToggleControl, RangeControl, Notice, Button, CheckboxControl, ColorIndicator, BaseControl } = wp.components;

// Base label helper
export const BaseLabel = BaseControl.VisualLabel ? BaseControl.VisualLabel : "span";

// Shared constants
export const PROMO_LINK = "https://publishpress.com/links/blocks-menu";

export const SUPPORTED_BLOCKS = [
    'advgb/accordion-item',
    'advgb/accordions',
    'advgb/adv-tabs',
    'advgb/adv-tab',
    'advgb/recent-posts',
    'advgb/images-slider',
    'advgb/button',
    'advgb/list',
    'advgb/count-up',
    'advgb/testimonial',
    'advgb/image'
];

export const CORE_SUPPORTED_BLOCKS = [
    'core/paragraph',
    'core/heading'
];

// Shared components
export function AdvFontControl(props) {

    return (
        <Fragment>
            <SelectControl
                label={__('Font Family', 'advanced-gutenberg')}
                value=""
                options={[{ label: 'Default', value: '' }]}
            />
            <SelectControl
                label={__('Font Weight + Style', 'advanced-gutenberg')}
                value=""
                options={[{ label: 'Default', value: '' }]}
            />
            <SelectControl
                label={__('Text Transform', 'advanced-gutenberg')}
                value=""
                options={[{ label: 'Default', value: '' }]}
            />
        </Fragment>

    )
}

export function AdvColorControl(props) {

    const { label, value, onChange } = props;
    return (
        <BaseControl
            className="editor-color-palette-control block-editor-color-palette-control"
        >
            <BaseLabel className="components-base-control__label">
                {label}
                {value && (
                    <ColorIndicator colorValue={value} />
                )}
            </BaseLabel>
            <ColorPalette
                className="editor-color-palette-control__color-palette block-editor-color-palette-control__color-palette"
                value={value}
            />
        </BaseControl>
    )
}

// Shared utility functions
export function advgbGetBlockTitle(name) {
    switch (name) {
        case 'advgb/accordion-item':
        case 'advgb/accordions':
            return __('Accordion', 'advanced-gutenberg');
            break;

        case 'advgb/adv-tabs':
        case 'advgb/tab':
            return __('Tabs', 'advanced-gutenberg');
            break;

        case 'advgb/recent-posts':
            return __('Content Display', 'advanced-gutenberg');
            break;

        case 'advgb/images-slider':
            return __('Images Slider', 'advanced-gutenberg');
            break;

        case 'advgb/button':
            return __('Button', 'advanced-gutenberg');
            break;

        case 'advgb/list':
            return __('List', 'advanced-gutenberg');
            break;

        case 'advgb/count-up':
            return __('Count Up', 'advanced-gutenberg');
            break;

        case 'advgb/testimonial':
            return __('Testimonial', 'advanced-gutenberg');
            break;

        case 'advgb/image':
            return __('Image', 'advanced-gutenberg');
            break;

        default:
            return __('PublishPress', 'advanced-gutenberg');
            break
    }
}

export function RecentPostsEditTitle(props) {

    const tabSelected = 'desktop';

    return (
        <Fragment>
            <div className="advgb-recent-posts-responsive-items">
                {['desktop', 'tablet', 'mobile'].map((device, index) => {
                    const itemClasses = [
                        "advgb-recent-posts-responsive-item",
                        tabSelected === device && 'is-selected',
                    ].filter(Boolean).join(' ');

                    return (
                        <div className={itemClasses}
                            key={index}
                        >
                            {device}
                        </div>
                    )
                })}
            </div>
            <div className="advgb-recent-posts-select-layout on-inspector">
                {tabSelected === 'desktop' &&
                    <Fragment>
                        <RangeControl
                            label={__('Font Size', 'advanced-gutenberg')}
                            value=""
                            min={10}
                            max={100}
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <ToggleControl
                            label={__('Hide', 'advanced-gutenberg')}
                            checked={false}
                        />
                    </Fragment>
                }
                {tabSelected === 'tablet' &&
                    <Fragment>
                        <RangeControl
                            label={__('Font Size', 'advanced-gutenberg')}
                            value=""
                            min={10}
                            max={100}
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <ToggleControl
                            label={__('Hide', 'advanced-gutenberg')}
                            checked={false}
                        />
                    </Fragment>
                }
                {tabSelected === 'mobile' &&
                    <Fragment>
                        <RangeControl
                            label={__('Font Size', 'advanced-gutenberg')}
                            value=""
                            min={10}
                            max={100}
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <ToggleControl
                            label={__('Hide', 'advanced-gutenberg')}
                            checked={false}
                        />
                    </Fragment>
                }
            </div>
        </Fragment>
    )
}