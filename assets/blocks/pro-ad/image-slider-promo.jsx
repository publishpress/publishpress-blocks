import {
    PROMO_LINK,
    AdvFontControl,
    __,
    addFilter,
    Fragment,
    InspectorControls,
    PanelBody,
    SelectControl,
    ToggleControl,
    RangeControl
} from './shared/index.jsx';;

// Images Slider block promo
addFilter('editor.BlockEdit', 'advgb/imagesSliderPro', function (BlockEdit) {
    return (props) => {
        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/images-slider' && (
                    <Fragment>
                        <InspectorControls>
                            <PanelBody title={__('Autoplay', 'advanced-gutenberg')} initialOpen={true} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <ToggleControl
                                            label={__('Autoplay', 'advanced-gutenberg')}
                                            checked={props.attributes.autoplay}
                                        />
                                        <RangeControl
                                            label={__('Autoplay Speed', 'advanced-gutenberg')}
                                            help={__('Change interval between slides in miliseconds.', 'advanced-gutenberg')}
                                            min={1000}
                                            max={20000}
                                            value={props.attributes.autoplaySpeed}
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips pp-tooltips-library click" data-toggle="tooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro add Autoplay and speed support.', 'advanced-gutenberg')}
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
                            <PanelBody title={__('Title', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <Fragment>
                                    <div className="advgb-promo-overlay-area">
                                        <div className="advgb-blur">
                                            <SelectControl
                                                label={__('Tag', 'advanced-gutenberg')}
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
                                            <AdvFontControl />
                                            <ToggleControl
                                                label={__('Display', 'advanced-gutenberg')}
                                                help={__('Disable this if you want to include the Title as alt attribute without displaying the title over the image.', 'advanced-gutenberg')}
                                                checked={props.attributes.titleShow}
                                            />
                                        </div>
                                        <div className="advgb-pro-overlay-wrap">
                                            <div className="advgb-pro-overlay-text advgb-tooltips pp-tooltips-library click" data-toggle="tooltip" data-placement="top">
                                                <span className="advgb-promo-icon">
                                                    <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                                </span>
                                                <span className="tooltip-text">
                                                    <p>
                                                        {__('PublishPress Blocks Pro supports Changing of title HTML tag for Images Slider block.', 'advanced-gutenberg')}
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
                                    <></>
                                </Fragment>
                            </PanelBody>
                            <PanelBody title={__('Text', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <SelectControl
                                            label={__('Tag', 'advanced-gutenberg')}
                                            value={props.attributes.textTag}
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
                                        <AdvFontControl />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips pp-tooltips-library click" data-toggle="tooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports Changing of text HTML tag for Images Slider block.', 'advanced-gutenberg')}
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