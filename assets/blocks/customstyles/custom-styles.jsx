(function ( wpI18n, wpHooks, wpBlocks, wpBlockEditor, wpComponents, wpCompose ) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    const { addFilter } = wpHooks;
    const { __ } = wpI18n;
    const { hasBlockSupport } = wpBlocks;
    const { InspectorControls } = wpBlockEditor;
    const { SelectControl } = wpComponents;
    const { createHigherOrderComponent } = wpCompose;

    const SUPPORTED_BLOCKS = [
        'core/paragraph',
        'core/heading',
        'core/list',
        'core/code',
        'core/preformatted',
        'core/table',
        'core/columns',
        'core/column',
        'core/group',
        'core/image',
    ];


    // Register custom styles to blocks attributes
    addFilter( 'blocks.registerBlockType', 'advgb/registerCustomStyleClass', function ( settings ) {
        if (SUPPORTED_BLOCKS.includes( settings.name )) {
            settings.attributes = Object.assign( settings.attributes, {
                customStyle: {
                    type: 'string'
                },
                identifyColor: {
                    type: 'string'
                }
            } );
        }

        return settings;
    } );

    // Add option to return to default style
    if (typeof advgbBlocksCustomStyles.customStyles !== 'undefined' && advgbBlocksCustomStyles.customStyles) {
        advgbBlocksCustomStyles.customStyles.unshift( {
            id: 0,
            label: __( 'Select a block style', 'advanced-gutenberg' ),
            value: '',
            identifyColor: ''
        } );
    }

    // Add option to select custom styles for supported blocks
    addFilter( 'editor.BlockEdit', 'advgb/customStyles', function ( BlockEdit ) {
        return ( props ) => {
            return ( [
                <BlockEdit key="block-edit-custom-class-name" {...props} />,
                props.isSelected && SUPPORTED_BLOCKS.includes( props.name ) &&
                <InspectorControls key="advgb-custom-controls">
                    <div className="advgb-custom-styles-wrapper">
                        <SelectControl
                            label={ [
                                __( 'Block styles', 'advanced-gutenberg' ),
                                <span className={'components-panel__color-area'}
                                      key="customstyle-identify"
                                      style={ {
                                          background: props.attributes.identifyColor,
                                          verticalAlign: 'text-bottom',
                                          borderRadius: '50%',
                                          border: 'none',
                                          width: '16px',
                                          height: '16px',
                                          display: 'inline-block',
                                          marginLeft: '10px',
                                      } } />
                            ] }
                            help={__( 'This option let you add custom style for the current block', 'advanced-gutenberg' )}
                            value={props.attributes.customStyle}
                            options={advgbBlocksCustomStyles.customStyles.map( ( cstyle, index ) => {
                                if (cstyle.title) advgbBlocksCustomStyles.customStyles[ index ].label = cstyle.title;
                                if (cstyle.name) advgbBlocksCustomStyles.customStyles[ index ].value = cstyle.name;

                                return cstyle;
                            } )}
                            onChange={( cstyle ) => {
                                const { identifyColor } = advgbBlocksCustomStyles.customStyles.filter( ( style ) => style.value === cstyle )[0];
                                props.setAttributes( {
                                    customStyle: cstyle,
                                    identifyColor: identifyColor,
                                    backgroundColor: undefined,
                                    textColor: undefined,
                                    fontSize: undefined,
                                } );
                            }}
                        />
                    </div>
                </InspectorControls>
            ] )
        }
    } );

    // Apply custom styles on front-end
    addFilter( 'blocks.getSaveContent.extraProps', 'advgb/loadFrontendCustomStyles', function ( extraProps, blockType, attributes ) {
        if (hasBlockSupport( blockType, 'customStyle', true ) && attributes.customStyle && typeof attributes.customStyle !== 'undefined') {
            if (typeof extraProps.className === 'undefined') {
                extraProps.className = attributes.customStyle;
            } else {
                extraProps.className += ' ' + attributes.customStyle;
                extraProps.className = extraProps.className.trim();
            }
        }

        return extraProps;
    } );


    const withStyleClasses = createHigherOrderComponent( ( BlockListBlock ) => {
        return ( props ) => {
            if ( ! SUPPORTED_BLOCKS.includes( props.name ) || !hasBlockSupport( props.name, 'customStyle', true ) ) {
                return <BlockListBlock { ...props } />
            }

            const {
                customStyle,
            } = props.attributes;

            if (customStyle && typeof customStyle !== 'undefined') {
                return <BlockListBlock { ...props } className={ `${ customStyle }` } />;
            } else {
                return <BlockListBlock { ...props } />
            }
        };
    }, 'withStyleClasses' );

    // Apply custom styles on back-end
    wp.hooks.addFilter( 'editor.BlockListBlock', 'advgb/loadBackendCustomStyles', withStyleClasses );

})( wp.i18n, wp.hooks, wp.blocks, wp.blockEditor, wp.components, wp.compose );
