import {
    PROMO_LINK,
    AdvColorControl,
    __,
    addFilter,
    Fragment,
    InspectorControls,
    PanelBody
} from './shared/index.jsx';;

// List block promo
addFilter('editor.BlockEdit', 'advgb/listPro', function (BlockEdit) {
    return (props) => {
        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/list' && (
                    <Fragment>
                        <InspectorControls>
                            <PanelBody title={__('Colors', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <AdvColorControl
                                            label={__('Text Color', 'advanced-gutenberg')}
                                            value={props.attributes.textColor}
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports custom colors for the list text.', 'advanced-gutenberg')}
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
        )
    }
});
