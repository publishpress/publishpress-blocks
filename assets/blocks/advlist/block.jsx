(function (wpI18n, wpBlocks, wpElement, wpBlockEditor, wpComponents, wpData) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    const {__} = wpI18n;
    const { Component, Fragment, renderToString, createElement } = wpElement;
    const { registerBlockType, createBlock } = wpBlocks;
    const { InspectorControls, RichText, ColorPalette, BlockControls, InnerBlocks } = wpBlockEditor;
    const { BaseControl, RangeControl, PanelBody, Dashicon, ToolbarGroup, ToolbarButton } = wpComponents;
    const { select, dispatch } = wpData;

    var parse = require('html-react-parser');

    const previewImageData = 'data:image/png;base64,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';

    let INNER_BLOCKS_TEMPLATE = [ [ 'advgb/list-item' ] ];

    class AdvList extends Component {
        constructor() {
            super(...arguments);

            this.state = {
                migrateValues: [],
                migrateStatus: null, // Status to migrate from <li> to innerBlocks. true: initialized, false: finished
                isBlockIdSet: false // @since 3.2.3
            }
        }

        componentWillMount() {
            const { attributes, setAttributes } = this.props;
            const currentBlockConfig = advgbDefaultConfig['advgb-list'];

            // No override attributes of blocks inserted before
            if (attributes.changed !== true) {
                if (typeof currentBlockConfig === 'object' && currentBlockConfig !== null) {
                    Object.keys(currentBlockConfig).map((attribute) => {
                        if (typeof attributes[attribute] === 'boolean') {
                            attributes[attribute] = !!currentBlockConfig[attribute];
                        } else {
                            attributes[attribute] = currentBlockConfig[attribute];
                        }
                    });
                }

                // Finally set changed attribute to true, so we don't modify anything again
                setAttributes({changed: true});
            }

            // Copy values into a state to migrate to innerBlocks
            if( attributes.values.length
                && attributes.values[0].hasOwnProperty( 'type' )
                && attributes.values[0].type === 'li'
            ) {
                this.setState( {
                    migrateValues: attributes.values,
                    migrateStatus: true
                } );

                // Empty template to avoid adding an empty List item at the end of each migrated List
                INNER_BLOCKS_TEMPLATE = [];
            }
        }

        componentDidMount() {
            const { setAttributes } = this.props;
            
            // Reset values attribute to default
            if( this.state.migrateStatus === true ) {
                setAttributes( {
                    values: []
                } );
            }
        }

        componentDidUpdate( prevProps ) {
            const { setAttributes, attributes, clientId } = this.props;
            const { getBlockOrder } = select( 'core/block-editor' );
            const innerBlocks = getBlockOrder( clientId );

            // @since 3.2.3 - https://github.com/publishpress/PublishPress-Blocks/issues/1389
            if (!this.state.isBlockIdSet) {
                setAttributes({ id: 'advgblist-' + clientId });
                this.setState({ isBlockIdSet: true });
            }

            if( this.state.migrateStatus === true
                && ! prevProps.attributes.values.length
                && this.state.migrateValues.length
            ) {

                // Migrate static HTML <li> elements to innerBlocks - since 3.1.3
                this.migrateToInnerBlocks( this.state.migrateValues );

            } else if( ! innerBlocks.length ) {

                // If no inner blocks, we add one
                const { insertBlock } = dispatch( 'core/block-editor' );

                insertBlock(
                    createBlock( 'advgb/list-item' ),
                    0,
                    clientId
                );

            } else {
                // Nothing to do here
            }
        }

        /**
         * Migrate static content from <li> tags to advgb/list-item innerBlocks
         *
         * @since 3.1.3
         *
         * @param {array} values Array of objects with list values
         *
         * @return {bool}
         */
        migrateToInnerBlocks( values ) {
            const { setAttributes, attributes, clientId } = this.props;
            const { insertBlock } = dispatch( 'core/block-editor' );

            let cancel = false;

            /* Convert from objects to HTML strings
             *
             * From:
             * {
             *   "type": "li",
             *   "props": {
             *     "children": [
             *       "Lorem ",
             *       {
             *         "type": "strong",
             *         "props": {
             *           "children": [
             *             "ipsum"
             *           ]
             *         }
             *       },
             *       " dolor"
             *     ]
             *   }
             * }
             *
             * To:
             * "Lorem <strong>ipsum</strong> dolor"
             */
            const parsedValues = values.map( ( item, n ) => {

                // Check if migration to innerBlocks was done before
                if( item.props === undefined ) {
                    cancel = true;
                    return;
                }

                return(
                    item.props.children.map( ( child ) => {
                        if ( typeof child === 'string' ) {
                            return child;
                        } else {
                            return renderToString( createElement( child.type, child.props, child.props.children ) );
                        }
                    } )
                );
            } );

            // Don't continue. Migration to innerBlocks was done before
            if( cancel === true ) {
                return;
            }

            /* Convert each array value into a merged string
             *
             * From:
             * [
             *   "Lorem ",
             *   "<strong>ipsum</strong>",
             *   " dolor"
             * ]
             *
             * To:
             * "Lorem <strong>ipsum</strong> dolor"
             */
            const stringValues = parsedValues.map( ( item ) => {
                return item.join( '' );
            } );

            // Insert content as advgb/list-item blocks
            stringValues.forEach( ( item, index ) => {

                insertBlock(
                    createBlock( 'advgb/list-item', {
                        content: item
                    } ),
                    index,
                    clientId
                );

            } );

            this.setState( { migrateStatus: false } );
        }

        render() {
            const listIcons = [
                {label: __('None', 'advanced-gutenberg'), value: ''},
                {label: __('Pushpin', 'advanced-gutenberg'), value: 'admin-post'},
                {label: __('Configuration', 'advanced-gutenberg'), value: 'admin-generic'},
                {label: __('Flag', 'advanced-gutenberg'), value: 'flag'},
                {label: __('Star', 'advanced-gutenberg'), value: 'star-filled'},
                {label: __('Checkmark', 'advanced-gutenberg'), value: 'yes'},
                {label: __('Checkmark 2', 'advanced-gutenberg'), value: 'yes-alt'},
                {label: __('Checkmark 3', 'advanced-gutenberg'), value: 'saved'},
                {label: __('Minus', 'advanced-gutenberg'), value: 'minus'},
                {label: __('Minus 2', 'advanced-gutenberg'), value: 'remove'},
                {label: __('Plus', 'advanced-gutenberg'), value: 'plus'},
                {label: __('Plus 2', 'advanced-gutenberg'), value: 'insert'},
                {label: __('Play', 'advanced-gutenberg'), value: 'controls-play'},
                {label: __('Arrow right', 'advanced-gutenberg'), value: 'arrow-right-alt'},
                {label: __('Arrow right 2', 'advanced-gutenberg'), value: 'arrow-right-alt2'},
                {label: __('X Cross 2', 'advanced-gutenberg'), value: 'no'},
                {label: __('X Cross', 'advanced-gutenberg'), value: 'dismiss'},
                {label: __('Warning', 'advanced-gutenberg'), value: 'warning'},
                {label: __('Help', 'advanced-gutenberg'), value: 'editor-help'},
                {label: __('Info', 'advanced-gutenberg'), value: 'info'},
                {label: __('Info 2', 'advanced-gutenberg'), value: 'info-outline'},
                {label: __('Circle', 'advanced-gutenberg'), value: 'marker'},
            ];
            const {
                attributes,
                setAttributes,
                className,
                clientId: blockID,
            } = this.props;
            const {
                id,
                values,
                icon,
                iconSize,
                iconColor,
                margin,
                padding,
                lineHeight,
                fontSize,
                isPreview,
            } = attributes;
            const listClassName = [
                className,
                id,
                icon && 'advgb-list',
                icon && `advgb-list-${icon}`
            ].filter(Boolean).join(' ');
            const size = typeof iconSize != 'undefined' ? parseInt(iconSize) : 16;
            const marg = typeof margin != 'undefined' ? parseInt(margin) : 2;
            const padd = typeof padding != 'undefined' ? parseInt(padding) * 2 : 4;

            return (
                isPreview ?
                    <img alt={__('Advanced List', 'advanced-gutenberg')} width='100%' src={previewImageData}/>
                    :
                    <Fragment>
                        <BlockControls>
                            <ToolbarGroup>
                                <ToolbarButton
                                    label={__('Refresh this list when it conflict with other lists styles', 'advanced-gutenberg')}
                                    icon="update"
                                    onClick={() => setAttributes({id: 'advgblist-' + blockID})}
                                />
                            </ToolbarGroup>
                        </BlockControls>
                        <InspectorControls>
                            <PanelBody title={__('Text Settings', 'advanced-gutenberg')} initialOpen={false}>
                                <RangeControl
                                    label={__('Text size', 'advanced-gutenberg')}
                                    value={fontSize || ''}
                                    onChange={(size) => setAttributes({fontSize: size})}
                                    min={10}
                                    max={100}
                                    beforeIcon="editor-textcolor"
                                    allowReset
                                />
                            </PanelBody>
                            <PanelBody title={__('Icon Settings', 'advanced-gutenberg')}>
                                <BaseControl label={__('List icon', 'advanced-gutenberg')}>
                                    <div className="advgb-icon-items-wrapper">
                                        {listIcons.map((item, index) => (
                                            <div className="advgb-icon-item h20" key={index}>
                                            <span onClick={() => setAttributes({icon: item.value})}
                                                  className={[
                                                      item.value === icon && 'active',
                                                      item.value === '' && 'remove-icon',
                                                  ].filter(Boolean).join(' ')}
                                            >
                                                <Dashicon icon={item.value}/>
                                            </span>
                                            </div>
                                        ))}
                                    </div>
                                </BaseControl>
                                {icon && (
                                    <Fragment>
                                        <PanelBody
                                            title={[
                                                __('Icon color', 'advanced-gutenberg'),
                                                <span key="advgb-list-icon-color"
                                                      className={`dashicons dashicons-${icon}`}
                                                      style={{color: iconColor, marginLeft: '10px'}}/>
                                            ]}
                                            initialOpen={false}
                                        >
                                            <ColorPalette
                                                value={iconColor}
                                                onChange={(value) => setAttributes({iconColor: value === undefined ? '#000' : value})}
                                            />
                                        </PanelBody>
                                        <RangeControl
                                            label={__('Icon size', 'advanced-gutenberg')}
                                            value={iconSize || ''}
                                            onChange={(size) => setAttributes({iconSize: size})}
                                            min={10}
                                            max={100}
                                            allowReset
                                        />
                                        <RangeControl
                                            label={__('Line height', 'advanced-gutenberg')}
                                            value={lineHeight || ''}
                                            onChange={(size) => setAttributes({lineHeight: size})}
                                            min={0}
                                            max={100}
                                            allowReset
                                        />
                                        <RangeControl
                                            label={__('Margin', 'advanced-gutenberg')}
                                            value={margin || ''}
                                            onChange={(size) => setAttributes({margin: size})}
                                            min={0}
                                            max={100}
                                            allowReset
                                        />
                                        <RangeControl
                                            label={__('Padding', 'advanced-gutenberg')}
                                            value={padding || ''}
                                            onChange={(size) => setAttributes({padding: size})}
                                            min={0}
                                            max={100}
                                            allowReset
                                        />
                                    </Fragment>
                                )}
                            </PanelBody>
                        </InspectorControls>
                        <ul className={ listClassName }>
                            <InnerBlocks
                                template={ INNER_BLOCKS_TEMPLATE }
                                templateLock={ false }
                                allowedBlocks={ [
                                    'advgb/list-item',
                                ] }
                                className={ listClassName }
                            />
                        </ul>
                        <div>
                            <style>
                                {`.${id} li { font-size: ${fontSize}px; }`}
                            </style>
                            {icon &&
                            <style>
                                {`.${id} li {
                                    padding-left: ${size + padd}px;
                                    margin-left: 0;
                                }
                                .${id} li:before {
                                    font-size: ${iconSize}px;
                                    color: ${iconColor};
                                    line-height: ${lineHeight}px;
                                    margin: ${margin}px;
                                    padding: ${padding}px;
                                    margin-left: -${size + padd + marg}px
                                }`}
                            </style>
                            }
                        </div>
                    </Fragment>
            )
        }
    }

    const listBlockIcon = (
        <svg height="20" viewBox="2 2 22 22" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
    );

    const listBlockAttrs = {
        id: {
            type: 'string'
        },
        icon: {
            type: 'string'
        },
        iconSize: {
            type: 'number',
            default: 16,
        },
        iconColor: {
            type: 'string',
            default: '#000',
        },
        fontSize: {
            type: 'number',
            default: 16,
        },
        lineHeight: {
            type: 'number',
            default: 18,
        },
        margin: {
            type: 'number',
            default: 2,
        },
        padding: {
            type: 'number',
            default: 2,
        },
        changed: {
            type: 'boolean',
            default: false,
        },
        isPreview: {
            type: 'boolean',
            default: false,
        },
        // Deprecated since 3.1.3
        values: {
            type: 'array',
            source: 'children',
            selector: 'ul',
            default: [],
        },
    };

    registerBlockType('advgb/list', {
        apiVersion: 3,
        title: __('List - PublishPress', 'advanced-gutenberg'),
        description: __('List block with custom icons and styles.', 'advanced-gutenberg'),
        icon: {
            src: listBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'advgb-category',
        keywords: [__('list', 'advanced-gutenberg'), __( 'advanced list', 'advanced-gutenberg' ), __('icon', 'advanced-gutenberg')],
        attributes: listBlockAttrs,
        example: {
            attributes: {
                isPreview: true
            },
        },
        transforms: {
            from: [
                {
                    type: 'block',
                    blocks: [ 'core/list' ],
                    transform: ( attributes, innerBlocks ) => {

                        const list = innerBlocks.map( ( item, index ) => {
                            return createBlock(
                                'advgb/list-item',
                                { ...attributes, content: innerBlocks[index].attributes.content }
                            );
                        } );

                        return createBlock(
                            'advgb/list',
                            { ...attributes, changed: false },
                            list,
                        )
                    }
                }
            ],
            to: [
                {
                    type: 'block',
                    blocks: [ 'core/list' ],
                    transform: ( attributes, innerBlocks ) => {

                        const list = innerBlocks.map( ( item, index ) => {
                            return createBlock(
                                'core/list-item',
                                { ...attributes, content: innerBlocks[index].attributes.content }
                            );
                        } );

                        return createBlock(
                            'core/list',
                            { attributes },
                            list,
                        )
                    }
                }
            ]
        },
        supports: {
            anchor: true,
        },
        edit: AdvList,
        save: function ({attributes}) {
            const {
                id,
                values,
                icon,
            } = attributes;
            const listClassName = [
                id,
                icon && 'advgb-list',
                icon && `advgb-list-${icon}`
            ].filter(Boolean).join(' ');

            return <div>
                <ul className={ listClassName }>
                    <InnerBlocks.Content />
                </ul>
            </div>
        },
        deprecated: [
            {
                attributes: listBlockAttrs,
                supports: {
                    anchor: true
                },
                save: ( { attributes } ) => {
                    const {
                        id,
                        values,
                        icon,
                    } = attributes;
                    const listClassName = [
                        id,
                        icon && 'advgb-list',
                        icon && `advgb-list-${icon}`
                    ].filter(Boolean).join(' ');

                    return <div>
                        <ul className={listClassName}>
                            {values}
                        </ul>
                    </div>
                }
            }
        ]
    });
})(wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components, wp.data);
