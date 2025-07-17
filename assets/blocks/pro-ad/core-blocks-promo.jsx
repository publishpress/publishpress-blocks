import {
    PROMO_LINK,
    CORE_SUPPORTED_BLOCKS,
    __,
    addFilter,
    Fragment,
    InspectorControls,
    PanelBody,
    SelectControl,
    ToggleControl
} from './shared/index.jsx';;

// core blocks promo
addFilter('editor.BlockEdit', 'advgb/coreBlocks', function (BlockEdit) {
    return (props) => {
        return (
            <Fragment>
                <BlockEdit key="block-edit-fonts" {...props} />
                {props.isSelected && CORE_SUPPORTED_BLOCKS.includes(props.name) &&
                    <InspectorControls>
                        <PanelBody title={__('Font Settings', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                            <div className="advgb-promo-overlay-area">
                                <div className="advgb-blur">
                                    <SelectControl
                                        label={__('Font Family', 'advanced-gutenberg')}
                                        value=""
                                        options={[
                                            { label: 'Default', value: '' },
                                        ]}
                                    />
                                    <SelectControl
                                        label={__('Font Weight + Style', 'advanced-gutenberg')}
                                        value=""
                                        options={[
                                            { label: 'Default', value: '' },
                                        ]}
                                    />
                                    <SelectControl
                                        label={__('Text Transform', 'advanced-gutenberg')}
                                        value=""
                                        options={[
                                            { label: 'Default', value: '' },
                                        ]}
                                    />
                                    <ToggleControl
                                        label={__('Force styling', 'advanced-gutenberg')}
                                        help={__('This adds !important to CSS in frontend to avoid your font being overridden', 'advanced-gutenberg')}
                                        checked={false}
                                        onChange=""
                                    />
                                </div>
                                <div className="advgb-pro-overlay-wrap">
                                    <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                        <span className="advgb-promo-text">
                                            {__('Pro', 'advanced-gutenberg')}
                                        </span>
                                        <span className="tooltip-text">
                                            <p>
                                                {__('PublishPress Blocks Pro supports Google Fonts for paragraphs and headings.', 'advanced-gutenberg')}
                                            </p>
                                            <p>
                                                <a className="clickable" href={PROMO_LINK} target="_blank">
                                                    {__('Upgrade to Pro', 'advanced-gutenberg')}
                                                </a>
                                            </p>
                                            <i></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    </InspectorControls>
                }
            </Fragment>
        )
    }
});
