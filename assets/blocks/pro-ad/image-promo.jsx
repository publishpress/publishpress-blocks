import {
    PROMO_LINK,
    __,
    addFilter,
    Fragment,
    InspectorControls,
    PanelBody,
    SelectControl
} from './shared/index.jsx';;

// Image block promo
addFilter('editor.BlockEdit', 'advgb/advImagePro', function (BlockEdit) {
    return (props) => {
        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/image' && (
                    <Fragment>
                        <InspectorControls>
                            <PanelBody title={__('Content Tags', 'advanced-gutenberg-pro')} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <SelectControl
                                            label={__('Title tag', 'advanced-gutenberg-pro')}
                                            value={props.attributes.titleTag}
                                            options={[
                                                { label: 'h1', value: 'h1' },
                                                { label: 'h2', value: 'h2' },
                                                { label: 'h3', value: 'h3' },
                                                { label: 'h4', value: 'h4' },
                                                { label: 'h5', value: 'h5' },
                                                { label: 'h6', value: 'h6' },
                                                { label: 'p', value: 'p' },
                                                { label: 'div', value: 'div' },
                                            ]}
                                        />
                                        <SelectControl
                                            label={__('Subtitle tag', 'advanced-gutenberg-pro')}
                                            value={props.attributes.subtitleTag}
                                            options={[
                                                { label: 'h1', value: 'h1' },
                                                { label: 'h2', value: 'h2' },
                                                { label: 'h3', value: 'h3' },
                                                { label: 'h4', value: 'h4' },
                                                { label: 'h5', value: 'h5' },
                                                { label: 'h6', value: 'h6' },
                                                { label: 'p', value: 'p' },
                                                { label: 'div', value: 'div' },
                                            ]}
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips pp-tooltips-library click" data-toggle="tooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports Changing of title and subtitle HTML tag for PublishPress Image block.', 'advanced-gutenberg')}
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