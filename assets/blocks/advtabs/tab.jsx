( function(wpI18n, wpBlocks, wpElement, wpBlockEditor, wpComponents) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    const { __ } = wpI18n;
    const { Component, Fragment } = wpElement;
    const { registerBlockType } = wpBlocks;
    const { InnerBlocks, RichText } = wpBlockEditor;
    const { select } = wp.data;

    const tabsBlockIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" d="M0,0h24v24H0V0z"/>
            <path fill="none" d="M0,0h24v24H0V0z"/>
            <path d="M21,3H3C1.9,3,1,3.9,1,5v14c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V5C23,3.9,22.1,3,21,3z M21,19H3V5h10v4h8V19z"/>
        </svg>
    );

    /**
     * This allows for checking to see if the block needs to generate a new ID.
     */
    const advgbTabsUniqueIDs = [];

    class TabItemEdit extends Component {
        constructor() {
            super( ...arguments );
            this.state = {
                isBlockIdSet: false // @since 3.2.3
            }
        }

        componentWillMount() {
            const { attributes, setAttributes, clientId } = this.props;

            const { getBlockRootClientId, getBlockAttributes } = !wp.blockEditor ? select( 'core/editor' ) : select( 'core/block-editor' );
            const rootBlockId = getBlockRootClientId( clientId );
            const rootBlockAttrs = getBlockAttributes( rootBlockId );

            // Apply parent style if newly inserted
            if (attributes.changed !== true) {
                if (rootBlockAttrs !== null && rootBlockAttrs.needUpdate !== false) {
                    Object.keys(rootBlockAttrs).map((attribute) => {
                        attributes[attribute] = rootBlockAttrs[attribute];
                    });

                    // Done applied, we will not do this again
                    setAttributes( { changed: true } );
                }
            }
        }

        componentDidMount() {
            const { attributes, setAttributes } = this.props;
            const { id, tabAnchors } = attributes;

            if(typeof tabAnchors !== 'undefined'){
                setAttributes({
                    anchor: tabAnchors[id]
                });
            }

        }

        componentDidUpdate() {
            const { attributes, setAttributes, clientId } = this.props;
            const { id, tabHeaders } = attributes;

            // @since 3.2.3 - https://github.com/publishpress/PublishPress-Blocks/issues/1389
            if (!this.state.isBlockIdSet) {
                const { getBlockRootClientId, getBlockAttributes } = !wpBlockEditor ? select('core/editor') : select('core/block-editor');
                const rootBlockId = getBlockRootClientId(clientId);
                const rootBlockAttrs = getBlockAttributes(rootBlockId);

                if (rootBlockAttrs && rootBlockAttrs.uniqueID) {
                    // Use parent's unique ID as base
                    this.props.setAttributes({
                        uniqueID: rootBlockAttrs.uniqueID
                    });
                } else {
                    // fallback if no root uniqueID
                    this.props.setAttributes({
                        uniqueID: '_' + clientId.substr(2, 9),
                    });
                }

                /*
                //This seems to be resulting in non unique id for other tabs except first tab.
                // I'll be removing it totally after user test the above solution instead
                if ( ! this.props.attributes.uniqueID ) {
                    this.props.setAttributes( {
                        uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
                    } );
                    advgbTabsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
                } else if ( advgbTabsUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
                    this.props.setAttributes( {
                        uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
                    } );
                    advgbTabsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
                } else {
                    advgbTabsUniqueIDs.push( this.props.attributes.uniqueID );
                }*/

                setAttributes({
                    header: tabHeaders[id]
                });

                this.setState({ isBlockIdSet: true });
            }
        }

        render() {
            const { attributes } = this.props;
            const {tabActive, id, uniqueID} = attributes;

            const ALLOWED_BLOCKS = wp.blocks.getBlockTypes().map(block => block.name).filter(
                blockName => ( blockName !== 'advgb/adv-tabs' && blockName !== 'advgb/tab' )
            );

            const tabClassName = [
                `advgb-tab-${uniqueID}`,
                'advgb-tab-body'
            ].filter(Boolean).join(' ');
            return (
                <Fragment>
                    <div className={tabClassName}
                         style={{
                             display: id === tabActive ? 'block' : 'none',
                         }}
                    >
                        <InnerBlocks
                            template={[ [ 'core/paragraph' ] ]}
                            templateLock={false}
                            allowedBlocks={ ALLOWED_BLOCKS }
                        />
                    </div>
                </Fragment>
            );
        }
    }

    registerBlockType( 'advgb/tab', {
        apiVersion: 3,
        title: __( 'Tab Item - PublishPress', 'advanced-gutenberg' ),
        parent: [ 'advgb/adv-tabs' ],
        icon: {
            src: tabsBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'advgb-category',
        attributes: {
            id: {
                type: 'number',
                default: 0
            },
            pid: {
                type: 'string',
            },
            header: {
                type: 'html',
            },
            anchor: {
                type: 'string',
            },
            tabActive: {
                type: 'number',
                default: 0,
            },
            changed: {
                type: 'boolean',
                default: false,
            },
            tabHeaders: {
                type: 'array',
                default: [
                    __( 'Tab 1', 'advanced-gutenberg' ),
                    __( 'Tab 2', 'advanced-gutenberg' ),
                    __( 'Tab 3', 'advanced-gutenberg' ),
                ]
            },
            tabAnchors: {
                type: 'array',
                default: [
                    '',
                    '',
                    ''
                ]
            },
            uniqueID: {
                type: 'string',
                default: '',
            }
        },
        supports: {
            reusable: false,
        },
        keywords: [ __( 'tab', 'advanced-gutenberg' ) ],
        edit: TabItemEdit,
        save: function( { attributes } ) {
            const { id, tabActive, header, uniqueID, anchor } = attributes;

            const tabClassName = [
                `advgb-tab-${uniqueID}`,
                'advgb-tab-body'
            ].filter(Boolean).join(' ');

            return (
                <div className="advgb-tab-body-container">
                    <div
                        className={`advgb-tab-body-header advgb-tab-class-${anchor} ${id === tabActive ? 'header-active' : ''}`}
                        id={`advgb-tab-panel-${uniqueID}-${id}`}
                        role="tabpanel"
                        aria-labelledby={`advgb-tab-${uniqueID}-${id}`}
                        tabIndex="0"
                    >
                        <RichText.Content
                            tagName="span"
                            value={header}
                        />
                    </div>
                    <div
                        className={tabClassName}
                        aria-labelledby={`advgb-tab-panel-${uniqueID}-${id}`}
                        style={{ display: id === tabActive ? 'block' : 'none' }}
                    >
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
        deprecated: [
            {
                attributes: {
                    id: {
                        type: 'number',
                        default: 0
                    },
                    pid: {
                        type: 'string',
                    },
                    header: {
                        type: 'html',
                    },
                    anchor: {
                        type: 'string',
                    },
                    tabActive: {
                        type: 'number',
                        default: 0,
                    },
                    changed: {
                        type: 'boolean',
                        default: false,
                    },
                    tabHeaders: {
                        type: 'array',
                        default: [
                            __( 'Tab 1', 'advanced-gutenberg' ),
                            __( 'Tab 2', 'advanced-gutenberg' ),
                            __( 'Tab 3', 'advanced-gutenberg' ),
                        ]
                    },
                    tabAnchors: {
                        type: 'array',
                        default: [
                            '',
                            '',
                            ''
                        ]
                    },
                    uniqueID: {
                        type: 'string',
                        default: '',
                    }
                },
                save: function( { attributes } ) {
                    const { id, tabActive, header, uniqueID, anchor } = attributes;

                    const tabClassName = [
                        `advgb-tab-${uniqueID}`,
                        'advgb-tab-body'
                    ].filter(Boolean).join(' ');

                    return (
                        <div className="advgb-tab-body-container">
                            <div
                                className={`advgb-tab-body-header advgb-tab-class-${anchor} ${id === tabActive ? 'header-active' : ''}`}
                                id={`advgb-tab-panel-${uniqueID}-${id}`}
                                role="tabpanel"
                                aria-labelledby={`advgb-tab-${uniqueID}-${id}`}
                                tabIndex="0"
                            >
                                {header}
                            </div>
                            <div
                                className={tabClassName}
                                aria-labelledby={`advgb-tab-panel-${uniqueID}-${id}`}
                                style={{ display: id === tabActive ? 'block' : 'none' }}
                            >
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                }
            },
            {
                attributes: {
                    id: {
                        type: 'number',
                        default: 0
                    },
                    pid: {
                        type: 'string',
                    },
                    header: {
                        type: 'html',
                    },
                    anchor: {
                        type: 'string',
                    },
                    tabActive: {
                        type: 'number',
                        default: 0,
                    },
                    changed: {
                        type: 'boolean',
                        default: false,
                    },
                    tabHeaders: {
                        type: 'array',
                        default: [
                            __( 'Tab 1', 'advanced-gutenberg' ),
                            __( 'Tab 2', 'advanced-gutenberg' ),
                            __( 'Tab 3', 'advanced-gutenberg' ),
                        ]
                    },
                    tabAnchors: {
                        type: 'array',
                        default: [
                            '',
                            '',
                            ''
                        ]
                    },
                    uniqueID: {
                        type: 'string',
                        default: '',
                    }
                },
                save: function( { attributes } ) {
                    const {id, uniqueID, header, anchor } = attributes;

                    const tabClassName = [
                        `advgb-tab-${uniqueID}`,
                        'advgb-tab-body'
                    ].filter(Boolean).join(' ');

                    return (
                        <div className="advgb-tab-body-container">
                            <div className={`advgb-tab-body-header advgb-tab-class-${anchor}`}>{header}</div>
                            <div className={tabClassName} aria-labelledby={`advgb-tabs-tab${id}`}>
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                }
            },
            {
                attributes: {
                    id: {
                        type: 'number',
                        default: 0
                    },
                    pid: {
                        type: 'string',
                    },
                    header: {
                        type: 'html',
                    },
                    tabActive: {
                        type: 'number',
                        default: 0,
                    },
                    changed: {
                        type: 'boolean',
                        default: false,
                    },
                    tabHeaders: {
                        type: 'array',
                        default: [
                            __( 'Tab 1', 'advanced-gutenberg' ),
                            __( 'Tab 2', 'advanced-gutenberg' ),
                            __( 'Tab 3', 'advanced-gutenberg' ),
                        ]
                    },
                    uniqueID: {
                        type: 'string',
                        default: '',
                    }
                },
                supports: {
                    reusable: false,
                },
                save: function( { attributes } ) {
                    const {id, uniqueID, header} = attributes;

                    const tabClassName = [
                        `advgb-tab-${uniqueID}`,
                        'advgb-tab-body'
                    ].filter(Boolean).join(' ');

                    return (
                        <div className="advgb-tab-body-container">
                            <div className="advgb-tab-body-header">{header}</div>
                            <div className={tabClassName} aria-labelledby={`advgb-tabs-tab${id}`}>
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                }
            },
            {
                attributes: {
                    pid: {
                        type: 'string',
                    },
                    header: {
                        type: 'html',
                    },
                    tabActive: {
                        type: 'number',
                        default: 0,
                    },
                    changed: {
                        type: 'boolean',
                        default: false,
                    },
                    tabHeaders: {
                        type: 'array',
                        default: [
                            __( 'Tab 1', 'advanced-gutenberg' ),
                            __( 'Tab 2', 'advanced-gutenberg' ),
                            __( 'Tab 3', 'advanced-gutenberg' ),
                        ]
                    },
                    uniqueID: {
                        type: 'string',
                        default: '',
                    }
                },
                save: function( { attributes } ) {
                    const {pid, header} = attributes;

                    return (
                        <div className="advgb-tab-body-container">
                            <div className="advgb-tab-body-header">{header}</div>
                            <div className="advgb-tab-body" id={pid}>
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                }
            },
            {
                attributes: {
                    id: {
                        type: 'number',
                        default: 0
                    },
                    pid: {
                        type: 'string',
                    },
                    header: {
                        type: 'html',
                    },
                    tabActive: {
                        type: 'number',
                        default: 0,
                    },
                    changed: {
                        type: 'boolean',
                        default: false,
                    },
                    tabHeaders: {
                        type: 'array',
                        default: [
                            __( 'Tab 1', 'advanced-gutenberg' ),
                            __( 'Tab 2', 'advanced-gutenberg' ),
                            __( 'Tab 3', 'advanced-gutenberg' ),
                        ]
                    },
                    uniqueID: {
                        type: 'string',
                        default: '',
                    },
                    anchor: {
                        type: 'string',
                        default: '',
                    }
                },
                save: function( { attributes } ) {
                    const { id, tabActive, header, uniqueID, anchor } = attributes;

                    const tabClassName = [
                        `advgb-tab-${uniqueID}`,
                        'advgb-tab-body'
                    ].filter(Boolean).join(' ');

                    return (
                        <div className="advgb-tab-body-container" style={{ display: id === tabActive ? 'block' : 'none' }}>
                            <div
                                className={`advgb-tab-body-header advgb-tab-class-${anchor}`}
                                id={`advgb-tab-panel-${uniqueID}-${id}`}
                                role="tabpanel"
                                aria-labelledby={`advgb-tab-${uniqueID}-${id}`}
                                tabIndex="0"
                            >
                                {header}
                            </div>
                            <div
                                className={tabClassName}
                                aria-labelledby={`advgb-tab-panel-${uniqueID}-${id}`}
                            >
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                }
            }
        ]
    });

} ) ( wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components );
