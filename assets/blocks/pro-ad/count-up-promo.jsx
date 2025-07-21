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

// Count Up block promo
addFilter('editor.BlockEdit', 'advgb/countUpPro', function (BlockEdit) {
    return (props) => {
        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/count-up' && (
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
                                        <span className="advgb-promo-text">
                                            {__('Pro', 'advanced-gutenberg')}
                                        </span>
                                        <span className="tooltip-text">
                                            <p>
                                                {__('PublishPress Blocks Pro support Text alignment for Count Up block.', 'advanced-gutenberg')}
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
                            <PanelBody title={__('Header & Description', 'advanced-gutenberg')} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <RangeControl
                                            label={__('Header size', 'advanced-gutenberg')}
                                            value={props.attributes.headerSize || ''}
                                            min={10}
                                            max={100}
                                            beforeIcon="editor-textcolor"
                                            allowReset
                                        />
                                        <RangeControl
                                            label={__('Description size', 'advanced-gutenberg')}
                                            value={props.attributes.descriptionSize || ''}
                                            min={10}
                                            max={100}
                                            beforeIcon="editor-textcolor"
                                            allowReset
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-text">
                                                {__('Pro', 'advanced-gutenberg')}
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports Custom header and description size for Count Up block.', 'advanced-gutenberg')}
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