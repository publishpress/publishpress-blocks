import {
    PROMO_LINK,
    SUPPORTED_BLOCKS,
    advgbGetBlockTitle,
    __,
    addFilter,
    sprintf,
    InspectorControls
} from './shared/index.jsx';;

// Add Upgrade to Pro Ad in sidebar
addFilter('editor.BlockEdit', 'advgb/proAd', function (BlockEdit) {
    return (props) => {
        return ([
            props.isSelected && SUPPORTED_BLOCKS.includes(props.name) &&
            <InspectorControls key="advgb-custom-controls">
                <div className="components-panel__body advgb-pro-ad-wrapper">
                    {sprintf(
                        __('Want more features in your %s blocks?', 'advanced-gutenberg'),
                        advgbGetBlockTitle(props.name)
                    )}
                    <br />
                    <a href={PROMO_LINK} className="advgb-pro-ad-btn" target="_blank">
                        {__('Upgrade to Pro', 'advanced-gutenberg')}
                    </a>
                </div>
            </InspectorControls>,
            <BlockEdit key="block-edit-custom-class-name" {...props} />,
        ])
    }
});