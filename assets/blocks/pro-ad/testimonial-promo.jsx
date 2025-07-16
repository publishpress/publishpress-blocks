import {
    PROMO_LINK,
    __,
    addFilter,
    Fragment,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
    PanelBody,
    RangeControl
} from './shared/index.jsx';;

// Testimonial block promo
addFilter('editor.BlockEdit', 'advgb/testimonialPro', function (BlockEdit) {
    return (props) => {
        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/testimonial' && (
                    <Fragment>
                        <BlockControls>
                            <div className="advgb-promo-overlay-area">
                                <div className="advgb-blur">
                                    <AlignmentToolbar
                                        value={props.attributes.align}
                                    />
                                </div>
                                <div className="advgb-pro-overlay-wrap">
                                    <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                        <span className="advgb-promo-icon">
                                            <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                        </span>
                                        <span className="tooltip-text">
                                            <p>
                                                {__('PublishPress Blocks Pro supports text alignment for testimonials.', 'advanced-gutenberg')}
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
                        </BlockControls>
                        <InspectorControls>
                            <PanelBody title={__('Content Size', 'advanced-gutenberg-pro')} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <RangeControl
                                            label={__('Name size', 'advanced-gutenberg-pro')}
                                            value={props.attributes.nameSize || ''}
                                            min={10}
                                            max={100}
                                            beforeIcon="editor-textcolor"
                                            allowReset
                                        />
                                        <RangeControl
                                            label={__('Position size', 'advanced-gutenberg-pro')}
                                            value={props.attributes.positionSize || ''}
                                            min={10}
                                            max={100}
                                            beforeIcon="editor-textcolor"
                                            allowReset
                                        />
                                        <RangeControl
                                            label={__('Description size', 'advanced-gutenberg-pro')}
                                            value={props.attributes.descriptionSize || ''}
                                            min={10}
                                            max={100}
                                            beforeIcon="editor-textcolor"
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
                                                    {__('PublishPress Blocks Pro supports custom sizes for names, job positions, and descriptions.', 'advanced-gutenberg')}
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
                    </Fragment>
                )}
            </Fragment>
        )
    }
});