import {
    PROMO_LINK,
    __,
    addFilter,
    Fragment,
    InspectorControls,
    PanelBody,
    SelectControl,
    RangeControl,
    Notice
} from './shared/index.jsx';;


// Accordion blocks promo
addFilter('editor.BlockEdit', 'advgb/advAccordionsPro', function (BlockEdit) {
    return (props) => {

        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/accordions' && (
                    <Fragment>
                        <InspectorControls>
                            <PanelBody title={__('Theme Settings', 'advanced-gutenberg')} className="advgb-pro-icon" initialOpen={false}>
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <SelectControl
                                            label={__('Preset', 'advanced-gutenberg')}
                                            value="default"
                                            options={[{ label: __('Default', 'advanced-gutenberg'), value: 'default' }]}
                                        />
                                        <Notice
                                            className="advgb-notice-sidebar"
                                            status="warning"
                                            isDismissible={false}
                                        >
                                            {__('Selecting or resetting a preset will override your current design configuration.', 'advanced-gutenberg')}
                                        </Notice>
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports several pre-built designs for accordions.', 'advanced-gutenberg')}
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

                            <PanelBody title={__('Accordion Settings', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <RangeControl
                                            label={__('Font Size', 'advanced-gutenberg')}
                                            value=""
                                            min={7}
                                            max={50}
                                            beforeIcon="editor-textcolor"
                                            allowReset
                                        />
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

                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports Google Fonts in accordions.', 'advanced-gutenberg')}
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
                        <></>
                    </Fragment>
                )}
            </Fragment>
        );
    };
});
