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


// Tab blocks promo
addFilter('editor.BlockEdit', 'advgb/advTabsPro', function (BlockEdit) {
    return (props) => {

        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/adv-tabs' && (
                    <Fragment>
                        <InspectorControls>
                            <PanelBody title={__('Theme Settings', 'advanced-gutenberg')} className="advgb-pro-icon" initialOpen={false}>
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <SelectControl
                                            label={__('Preset', 'advanced-gutenberg')}
                                            value="default"
                                            options={[
                                                { label: __('Default', 'advanced-gutenberg'), value: 'default' }
                                            ]}
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
                                                    {__('PublishPress Blocks Pro supports several pre-built designs for tabs.', 'advanced-gutenberg')}
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
                            <PanelBody title={__('Tab Settings', 'advanced-gutenberg')} className="advgb-pro-icon" initialOpen={false}>
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
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
                                        <RangeControl
                                            label={__('Font Size', 'advanced-gutenberg')}
                                            value=""
                                            min={7}
                                            max={100}
                                            beforeIcon="editor-textcolor"
                                            allowReset
                                        />
                                        <RangeControl
                                            label={__('Spacing below', 'advanced-gutenberg')}
                                            help={
                                                __('You can set a negative spacing below that depends on border width', 'advanced-gutenberg')
                                            }
                                            value={8}
                                            min={-30}
                                            max={30}
                                            beforeIcon="arrow-down-alt"
                                            allowReset
                                        />
                                        <RangeControl
                                            label={__('Spacing on the right', 'advanced-gutenberg')}
                                            value={8}
                                            min={-30}
                                            max={30}
                                            beforeIcon="arrow-right-alt"
                                            allowReset
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports Google Fonts in tabs.', 'advanced-gutenberg')}
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
