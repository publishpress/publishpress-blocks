
import {
    PROMO_LINK,
    AdvFontControl,
    AdvColorControl,
    RecentPostsEditTitle,
    __,
    addFilter,
    Fragment,
    createHigherOrderComponent,
    InspectorControls,
    PanelBody,
    SelectControl,
    ToggleControl,
    CheckboxControl,
    RangeControl
} from './shared/index.jsx';;

// Recent posts block promo
const recentPostsProSidebar = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        return (
            <Fragment>
                <BlockEdit {...props} />
                {props.isSelected && props.name === 'advgb/recent-posts' && (
                    <Fragment>
                        <InspectorControls>
                            <PanelBody title={__('Slider View Autoplay', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <RangeControl
                                            label={__('Autoplay Speed', 'advanced-gutenberg')}
                                            help={__('Change interval between slides in miliseconds.', 'advanced-gutenberg')}
                                            min={1000}
                                            max={20000}
                                            value=""
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports autoplay speed control for the slider view.', 'advanced-gutenberg')}
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
                                            <AdvFontControl />
                                            <RangeControl
                                                label={__('Line height (em)', 'advanced-gutenberg')}
                                                step={0.1}
                                                value=""
                                                allowReset
                                            />
                                            <AdvColorControl
                                                label={__('Color', 'advanced-gutenberg')}
                                                value=""
                                            />
                                            <AdvColorControl
                                                label={__('Color (hover)', 'advanced-gutenberg')}
                                                value=""
                                            />
                                            <RecentPostsEditTitle />
                                        </div>
                                        <div className="advgb-pro-overlay-wrap">
                                            <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                                <span className="advgb-promo-icon">
                                                    <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                                </span>
                                                <span className="tooltip-text">
                                                    <p>
                                                        {__('PublishPress Blocks Pro supports multiple style options for the content display.', 'advanced-gutenberg')}
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
                            <PanelBody title={__('Featured Image', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <ToggleControl
                                            label={__('Custom image size', 'advanced-gutenberg')}
                                            checked={false}
                                        />
                                    </div>
                                </div>
                                <Fragment>
                                    <div className="advgb-promo-overlay-area">
                                        <div className="advgb-blur">
                                            <CheckboxControl
                                                label={__('auto', 'advanced-gutenberg')}
                                                checked={true}
                                                className="advgb-single-checkbox"
                                            />
                                            <div className="advgb-controls-title">
                                                <span>
                                                    {__('Image width', 'advanced-gutenberg')}
                                                </span>
                                                <div className="advgb-unit-wrapper" key="unit">
                                                    {['px', '%'].map((unit, uIdx) => (
                                                        <span
                                                            className={`advgb-unit ${'px' === unit ? 'selected' : ''}`}
                                                            key={uIdx}
                                                        >
                                                            {unit}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <RangeControl
                                                value=""
                                                min={0}
                                                max={2000}
                                                help={__('Uncheck "auto" to set a custom width', 'advanced-gutenberg')}
                                            />
                                            <CheckboxControl
                                                label={__('auto', 'advanced-gutenberg')}
                                                checked={true}
                                                className="advgb-single-checkbox"
                                            />
                                            <div className="advgb-controls-title">
                                                <span>
                                                    {__('Image height', 'advanced-gutenberg')}
                                                </span>
                                                <div className="advgb-unit-wrapper" key="unit">
                                                    px
                                                </div>
                                            </div>
                                            <RangeControl
                                                value=""
                                                min={100}
                                                max={2000}
                                                disabled={true}
                                                help={__('Uncheck "auto" to set a custom height', 'advanced-gutenberg')}
                                            />
                                            <ToggleControl
                                                label={__('Force custom size', 'advanced-gutenberg')}
                                                help={__('This adds !important to CSS in frontend to avoid custom size being overridden. Disable if breaks the layout.', 'advanced-gutenberg')}
                                                checked={false}
                                            />
                                        </div>
                                        <div className="advgb-pro-overlay-wrap">
                                            <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                                <span className="advgb-promo-icon">
                                                    <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                                </span>
                                                <span className="tooltip-text">
                                                    <p>
                                                        {__('PublishPress Blocks Pro supports custom image options.', 'advanced-gutenberg')}
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
                            <PanelBody title={__('Info', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <AdvFontControl />
                                        <AdvColorControl
                                            label={__('Color', 'advanced-gutenberg')}
                                            value=""
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports multiple style options for the info display.', 'advanced-gutenberg')}
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
                                <Fragment>
                                    <div className="advgb-promo-overlay-area">
                                        <div className="advgb-blur">
                                            <AdvColorControl
                                                label={__('Color for links', 'advanced-gutenberg')}
                                                value=""
                                            />
                                            <AdvColorControl
                                                label={__('Color for links (hover)', 'advanced-gutenberg')}
                                                value=""
                                            />
                                        </div>
                                    </div>
                                    <></>
                                </Fragment>
                            </PanelBody>

                            <PanelBody
                                title={!props.attributes.postType || props.attributes.postType === 'post' ? __('Tags and Categories', 'advanced-gutenberg') : __('Taxonomies', 'advanced-gutenberg')}
                                initialOpen={false}
                                className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <AdvFontControl />
                                        <AdvColorControl
                                            label={__('Color', 'advanced-gutenberg')}
                                            value=""
                                        />
                                        <AdvColorControl
                                            label={__('Color (hover)', 'advanced-gutenberg')}
                                            value=""
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports multiple style options for the taxonomy display.', 'advanced-gutenberg')}
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
                            </PanelBody>

                            <PanelBody title={__('Content', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <AdvFontControl />
                                        <AdvColorControl
                                            label={__('Color', 'advanced-gutenberg')}
                                            value=""
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-icon">
                                                <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports multiple style options for the content display.', 'advanced-gutenberg')}
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

                            <Fragment>
                                <PanelBody title={__('Read more link', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                    <div className="advgb-promo-overlay-area">
                                        <div className="advgb-blur">
                                            <AdvFontControl />
                                            <SelectControl
                                                label={__('Text Decoration', 'advanced-gutenberg')}
                                                value="default"
                                                options={[{ label: __('Default', 'advanced-gutenberg'), value: 'default' }]}
                                            />
                                            <SelectControl
                                                label={__('Text Decoration (hover)', 'advanced-gutenberg')}
                                                value="default"
                                                options={[{ label: __('Default', 'advanced-gutenberg'), value: 'default' }]}
                                            />
                                            <AdvColorControl
                                                label={__('Text Color', 'advanced-gutenberg')}
                                                value=""
                                            />
                                            <AdvColorControl
                                                label={__('Text Color (hover)', 'advanced-gutenberg')}
                                                value=""
                                            />
                                            <AdvColorControl
                                                label={__('Background Color', 'advanced-gutenberg')}
                                                value=""
                                            />
                                            <AdvColorControl
                                                label={__('Background Color (hover)', 'advanced-gutenberg')}
                                                value=""
                                            />
                                            <SelectControl
                                                label={__('Border style', 'advanced-gutenberg')}
                                                value="none"
                                                options={[
                                                    { label: __('Default', 'advanced-gutenberg'), value: 'none' }
                                                ]}
                                            />
                                        </div>
                                        <div className="advgb-pro-overlay-wrap">
                                            <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                                <span className="advgb-promo-icon">
                                                    <i className="dashicons dashicons dashicons-lock block-promo-button"></i>
                                                </span>
                                                <span className="tooltip-text">
                                                    <p>
                                                        {__('PublishPress Blocks Pro supports multiple style options for the read more display.', 'advanced-gutenberg')}
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
                                    <Fragment>
                                        <div className="advgb-promo-overlay-area">
                                            <div className="advgb-blur">
                                                <AdvColorControl
                                                    label={__('Border Color', 'advanced-gutenberg')}
                                                    value=""
                                                />
                                                <AdvColorControl
                                                    label={__('Border Color (hover)', 'advanced-gutenberg')}
                                                    value=""
                                                />
                                                <RangeControl
                                                    label={__('Border width', 'advanced-gutenberg')}
                                                    value=""
                                                    min={0}
                                                    max={10}
                                                />
                                                <RangeControl
                                                    label={__('Border radius', 'advanced-gutenberg')}
                                                    value={0}
                                                    min={0}
                                                    max={100}
                                                />
                                            </div>
                                        </div>
                                        <></>
                                    </Fragment>
                                    <Fragment>
                                        <div className="advgb-promo-overlay-area">
                                            <div className="advgb-blur">
                                                <ToggleControl
                                                    label={__('Enable padding', 'advanced-gutenberg')}
                                                    checked={false}
                                                />
                                                <RangeControl
                                                    label={__('Padding top', 'advanced-gutenberg')}
                                                    value=""
                                                    min={0}
                                                    max={50}
                                                />
                                                <RangeControl
                                                    label={__('Padding right', 'advanced-gutenberg')}
                                                    value=""
                                                    min={0}
                                                    max={50}
                                                />
                                                <RangeControl
                                                    label={__('Padding bottom', 'advanced-gutenberg')}
                                                    value=""
                                                    min={0}
                                                    max={50}
                                                />
                                                <RangeControl
                                                    label={__('Padding left', 'advanced-gutenberg')}
                                                    value=""
                                                    min={0}
                                                    max={50}
                                                />
                                            </div>
                                        </div>
                                        <></>
                                    </Fragment>
                                </PanelBody>
                                <></>
                            </Fragment>
                        </InspectorControls>
                        <></>
                    </Fragment>
                )}
            </Fragment>
        )
    };
}, 'recentPostsProSidebar');
addFilter('editor.BlockEdit', 'advgb/recentPostsPro', recentPostsProSidebar);