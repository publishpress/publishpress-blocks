import {
    PROMO_LINK,
    AdvFontControl,
    __,
    addFilter,
    Fragment,
    InspectorControls,
    PanelBody,
    ToggleControl
} from './shared/index.jsx';;

// Button block promo
addFilter('editor.BlockEdit', 'advgb/advButtonPro', function (BlockEdit) {
    return (props) => {
        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/button' && (
                    <Fragment>
                        <InspectorControls>
                            <PanelBody title={__('Font', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <AdvFontControl />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports Google Fonts in buttons.', 'advanced-gutenberg')}
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
                            <PanelBody title={__('Link rel', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <ToggleControl
                                            label="noreferrer"
                                            checked={props.attributes.noreferrer}
                                        />
                                        <ToggleControl
                                            label="nofollow"
                                            checked={props.attributes.nofollow}
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro includes nofollow and noreferrer support.', 'advanced-gutenberg')}
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