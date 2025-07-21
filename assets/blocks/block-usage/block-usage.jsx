(function (wpI18n, wpHooks, wpBlocks, wpBlockEditor, wpComponents, wpCompose, wpElement) {
    const { render, useState, useEffect, useRef, useMemo } = wpElement;
    const { PanelBody, Button, Card, Spinner, Flex, FlexItem, ProgressBar, Notice, FormTokenField } = wpComponents;
    const { __, sprintf } = wpI18n;

    // IndexedDB setup
    const DB_NAME = 'publishpress_blocks';
    const STORE_NAME = 'block_usage_data';
    const DB_VERSION = 1;
    const EXCLUDED_BLOCKS = ['advgb/accordion'];

    const openDatabase = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                }
            };
        });
    };

    const getFromCache = async (key) => {
        try {
            const db = await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(key);

                request.onerror = () => reject('Error reading from cache');
                request.onsuccess = () => resolve(request.result ? request.result.value : null);
            });
        } catch (error) {
            console.error('Cache error:', error);
            return null;
        }
    };

    const saveToCache = async (key, value) => {
        try {
            const db = await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ key, value });

                request.onerror = () => reject('Error saving to cache');
                request.onsuccess = () => resolve();
            });
        } catch (error) {
            console.error('Cache error:', error);
        }
    };

    const clearCache = async () => {
        try {
            const db = await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.clear();

                request.onerror = () => reject('Error clearing cache');
                request.onsuccess = () => resolve();
            });
        } catch (error) {
            console.error('Cache error:', error);
            throw error;
        }
    };

    const getBlocks = () => {
        if (typeof wp.blocks === 'undefined') {
            return { blocks: [], categories: [] };
        }

        // Register core blocks if available
        if (wp.blockLibrary && typeof wp.blockLibrary.registerCoreBlocks === 'function') {
            wp.blockLibrary.registerCoreBlocks();
        }

        let allBlocks = wp.blocks.getBlockTypes();
        let allCategories = wp.blocks.getCategories();
        let listBlocks = [];

        // Get the category titles from localized data if available
        const localizedCategories = (window.advgb_block_usage_data || {}).blockCategories || [];
        const categoryTitleMap = localizedCategories.reduce((map, cat) => {
            map[cat.slug] = cat.title;
            return map;
        }, {});

        // Get blocks saved in advgb_block_usage_data.saved_blocks option
        const { saved_blocks = [] } = window.advgb_block_usage_data || {};
        if (saved_blocks.length > 0) {
            const diff_blocks = saved_blocks.filter(
                blocksA => !allBlocks.some(blocksB => blocksA.name === blocksB.name)
            );
            if (diff_blocks.length > 0) {
                allBlocks = [...allBlocks, ...diff_blocks];
            }
        }

        // Force activate blocks (like widget blocks)
        const force_activate_blocks = [
            {
                'name': 'core/widget-group',
                'icon': 'block-default',
                'title': 'Widget Group',
                'category': 'widgets'
            },
        ];
        allBlocks = [...allBlocks, ...force_activate_blocks];

        // Additional blocks to include
        const include_blocks = [
            {
                'name': 'core/legacy-widget',
                'icon': 'block-default',
                'title': 'Legacy Widget',
                'category': 'widgets'
            }
        ];
        allBlocks = [...allBlocks, ...include_blocks];

        // Process all blocks to standardize the format
        allBlocks.forEach(function (block) {
            // Skip excluded blocks
            if (EXCLUDED_BLOCKS.includes(block.name)) {
                return;
            }
            var blockItemIcon = '';
            const blockItem = {
                name: block.name,
                icon: block.icon.src || block.icon,
                title: block.title,
                category: block.category || 'common',
                parent: block.parent,
                description: block.description || ''
            };

            // Use the localized category title if available
            if (categoryTitleMap[blockItem.category]) {
                blockItem.categoryTitle = categoryTitleMap[blockItem.category];
            }

            const savedIcon = !!block.icon.src ? block.icon.src : block.icon;

            if (block.icon.foreground !== undefined) blockItem.iconColor = block.icon.foreground;

            if (typeof savedIcon === 'function') {
                if (typeof savedIcon.prototype !== 'undefined') {
                    blockItem.icon = wp.element.renderToString(wp.element.createElement(savedIcon));
                    blockItem.icon = blockItem.icon.replace(/stopcolor/g, 'stop-color');
                    blockItem.icon = blockItem.icon.replace(/stopopacity/g, 'stop-opacity');
                } else {
                    blockItemIcon = wp.element.createElement(wp.components.Dashicon, { icon: 'block-default' });
                    blockItem.icon = wp.element.renderToString(blockItemIcon);
                }
            } else if (typeof savedIcon === 'object') {
                blockItem.icon = wp.element.renderToString(savedIcon);
                blockItem.icon = blockItem.icon.replace(/stopcolor/g, 'stop-color');
                blockItem.icon = blockItem.icon.replace(/stopopacity/g, 'stop-opacity');
            } else if (
                typeof savedIcon === 'string'
                && !savedIcon.includes('<span') // Merged blocks icons from 'advgb_blocks_list' are stored as html
                && !savedIcon.includes('<svg') // Merged blocks icons from 'advgb_blocks_list' are stored as html
            ) {
                blockItemIcon = wp.element.createElement(wp.components.Dashicon, { icon: savedIcon });
                blockItem.icon = wp.element.renderToString(blockItemIcon);
            } else {
                blockItem.icon = savedIcon; // Pure html for merged blocks icons from 'advgb_blocks_list'
            }

            listBlocks.push(blockItem);
        });

        // Remove duplicated blocks by block name
        const uniqueNames = [];
        let i = listBlocks.length;
        while (i--) {
            const name = listBlocks[i].name;
            if (uniqueNames.includes(name)) {
                listBlocks.splice(i, 1);
            } else {
                uniqueNames.push(name);
            }
        }

        // Sort categories to show "advgb-category" first
        allCategories.sort((a, b) => {
            if (a.slug === 'advgb-category') return -1;
            if (b.slug === 'advgb-category') return 1;
            return 0;
        });

        // Add any missing categories from localized data
        localizedCategories.forEach(localizedCat => {
            if (!allCategories.some(cat => cat.slug === localizedCat.slug)) {
                allCategories.push({
                    slug: localizedCat.slug,
                    title: localizedCat.title
                });
            }
        });

        return {
            blocks: listBlocks,
            categories: allCategories
        };
    };

    const Sidebar = React.memo(({ selected, data, onClose, canEditPosts }) => {
        const [expandedPost, setExpandedPost] = useState(null);
        const { usage = {}, posts = [] } = data;

        const blockData = usage[selected?.name] || { posts: {}, total: 0 };
        const postIds = Object.keys(blockData.posts);

        // Get posts that contain this block
        const blockPosts = useMemo(() => {
            return posts.filter(post => postIds.includes(post.post_id.toString()));
        }, [posts, postIds]);

        // Group posts by title (for multiple instances in same post)
        const groupedPosts = useMemo(() => {
            const groups = {};

            blockPosts.forEach(post => {
                const count = blockData.posts[post.post_id]?.count || 0;
                const scanned = blockData.posts[post.post_id]?.scanned || '';

                const key = `${post.post_title}-${post.post_id}`;

                if (!groups[key]) {
                    groups[key] = {
                        ...post,
                        totalCount: 0,
                        scanned
                    };
                }

                groups[key].totalCount += count;
            });

            return Object.values(groups);
        }, [blockPosts, blockData]);

        const renderBlockItem = (block, depth = 0) => {
            if (!block.name) return null;

            return (
                <div
                    key={block.clientId || `${block.name}-${depth}-${Math.random().toString(36).substr(2, 9)}`}
                    className="pp-blocks-usage-post-block-item"
                    style={{ marginLeft: `${depth * 15}px` }}
                >
                    <div className="pp-blocks-usage-block-name">
                        {block.icon && (
                            <span className="block-icon" style={block.iconColor ? { color: block.iconColor } : {}}>
                                {typeof block.icon === 'string' && !block.icon.includes('<') ? (
                                    <span className={`dashicons dashicons-${block.icon}`}></span>
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: block.icon }} />
                                )}
                            </span>
                        )}
                        {block.name}
                    </div>
                    {block.innerBlocks?.map(innerBlock => renderBlockItem(innerBlock, depth + 1))}
                </div>
            );
        };

        return (
            <div className="pp-blocks-usage-sidebar" ref={useRef(null)}>
                <div className="pp-blocks-usage-sidebar-header">
                    <h2>
                        <div className="pp-blocks-usage-tile-main">
                            <span>{selected.title}</span>
                        </div>
                        <span className="pp-blocks-usage-panel-subtitle">
                            {groupedPosts.length} {__('locations', 'advanced-gutenberg')} | {blockData.total} {__('instances', 'advanced-gutenberg')}
                        </span>
                    </h2>
                </div>
                <div className="pp-blocks-usage-sidebar-content">
                    <div className="pp-blocks-usage-block-meta">
                        <p><strong>{__('Name:', 'advanced-gutenberg')}</strong> {selected.title}</p>
                        <p><strong>{__('Description:', 'advanced-gutenberg')}</strong> {selected.description}</p>
                        <p><strong>{__('Category:', 'advanced-gutenberg')}</strong> {selected.category}</p>
                    </div>

                    {groupedPosts.length > 0 ? (
                        <>
                            <div className="pp-blocks-usage-usage-stats">
                                <span><strong>{__('Locations:', 'advanced-gutenberg')}</strong> {groupedPosts.length}</span>
                                <span><strong>{__('Total instances:', 'advanced-gutenberg')}</strong> {blockData.total}</span>
                            </div>

                            <div className="pp-blocks-usage-post-list">
                                {groupedPosts.map((post) => {
                                    const isExpanded = expandedPost === post.post_id;
                                    const postTypeLabel = post.post_type;

                                    return (
                                        <div key={post.post_id} className={`pp-blocks-usage-post-item ${isExpanded ? 'expanded' : ''}`}>
                                            <div
                                                className="pp-blocks-usage-post-header"
                                                onClick={() => setExpandedPost(isExpanded ? null : post.post_id)}
                                            >
                                                <div className="pp-blocks-usage-post-title">
                                                    {post.post_title}
                                                </div>
                                                <div className="pp-blocks-usage-post-meta">
                                                    <span className="pp-blocks-usage-post-type">
                                                        {postTypeLabel}
                                                    </span>
                                                </div>
                                                <Button
                                                    size="small"
                                                    icon={isExpanded ? 'arrow-up-alt2' : 'arrow-down-alt2'}
                                                    className="pp-blocks-usage-expand-button"
                                                />
                                            </div>

                                            {isExpanded && (
                                                <div className="pp-blocks-usage-post-content">
                                                    <div className="pp-blocks-usage-post-actions">
                                                        {post.edit_link && canEditPosts && (
                                                            <Button
                                                                variant="secondary"
                                                                isSmall
                                                                href={post.edit_link}
                                                                target="_blank"
                                                            >
                                                                {__('Edit Post', 'advanced-gutenberg')}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="secondary"
                                                            size="small"
                                                            href={post.view_link}
                                                            target="_blank"
                                                        >
                                                            {__('View Post', 'advanced-gutenberg')}
                                                        </Button>
                                                    </div>
                                                    <div className="pp-blocks-usage-post-blocks">
                                                        <h4>{__('Blocks in this post:', 'advanced-gutenberg')}</h4>
                                                        {post.blocks?.length > 0 ? (
                                                            post.blocks.map(block => renderBlockItem(block))
                                                        ) : (
                                                            <p>{__('No blocks found in this post.', 'advanced-gutenberg')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="pp-blocks-usage-no-results">
                            {data.lastScanDate ? (
                                <>
                                    <p><em>{__('This block was not found in any posts.', 'advanced-gutenberg')}</em></p>
                                    <p>{__('Last scan:', 'advanced-gutenberg')} {new Date(data.lastScanDate).toLocaleString()}</p>
                                </>
                            ) : (
                                <>
                                    <p><em>{__('No scan history available for this block.', 'advanced-gutenberg')}</em></p>
                                    <p>{__('Click the Scan button to check for usage.', 'advanced-gutenberg')}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    });

    const App = () => {
        const {
            ajaxUrl = '',
            nonce = '',
            initialData,
            currentUser
        } = window.advgb_block_usage_data || {};

        const [blocksData, setBlocksData] = useState(() => getBlocks());
        const [data, setData] = useState(initialData);
        const [loadingAll, setLoadingAll] = useState(false);
        const [loadingClearAll, setLoadingClearAll] = useState(false);
        const [selected, setSelected] = useState(null);
        const [showEmptyBlocks, setShowEmptyBlocks] = useState(false);
        const [selectedPostTypes, setSelectedPostTypes] = useState(['post', 'page']);
        const [scanProgress, setScanProgress] = useState({
            current: 0,
            total: 0,
            status: '',
            completed: false
        });
        const [dbError, setDbError] = useState(null);
        const [initialLoadComplete, setInitialLoadComplete] = useState(false);

        // Load data from IndexedDB on initial render
        useEffect(() => {
            const loadData = async () => {
                try {
                    const cachedData = await getFromCache('block_usage_data');
                    const cachedSettings = await getFromCache('block_usage_settings');

                    if (cachedData) {
                        setData(cachedData);
                    }

                    if (cachedSettings) {
                        setShowEmptyBlocks(cachedSettings.showEmptyBlocks !== false);

                        if (cachedSettings.lastSelectedBlock) {
                            const lastSelected = blocksData.blocks.find(b => b.name === cachedSettings.lastSelectedBlock);
                            if (lastSelected) {
                                setSelected(lastSelected);
                            }
                        }

                        if (cachedSettings.selectedPostTypes) {
                            setSelectedPostTypes(cachedSettings.selectedPostTypes);
                        }
                    }
                    setInitialLoadComplete(true);
                } catch (error) {
                    console.error('Failed to load data from IndexedDB:', error);
                    setDbError(__('Failed to load data from local storage. Please refresh the page.', 'advanced-gutenberg'));
                    setInitialLoadComplete(true);
                }
            };

            loadData();
        }, [blocksData.blocks]);

        const postAjax = (action, data = {}) => {
            const body = new URLSearchParams({ action, nonce, ...data });
            return fetch(ajaxUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            }).then(r => r.json());
        };

        const handleToggleChange = async (value) => {
            setShowEmptyBlocks(value);
            try {
                await saveToCache('block_usage_settings', {
                    showEmptyBlocks: value,
                    lastSelectedBlock: selected?.name || '',
                    selectedPostTypes: selectedPostTypes
                });
            } catch (error) {
                console.error('Failed to save showEmptyBlocks setting:', error);
            }
        };

        const handlePostTypeChange = async (newPostTypes) => {
            setSelectedPostTypes(newPostTypes);
            try {
                await saveToCache('block_usage_settings', {
                    showEmptyBlocks,
                    lastSelectedBlock: selected?.name || '',
                    selectedPostTypes: newPostTypes
                });
            } catch (error) {
                console.error('Failed to save post types:', error);
            }
        };

        const categories = useMemo(() => {
            const cats = {};

            // First create the advgb-category if it exists
            const advgbCategory = blocksData.categories.find(cat => cat.slug === 'advgb-category');
            if (advgbCategory) {
                cats[advgbCategory.slug] = {
                    title: advgbCategory.title,
                    blocks: []
                };
            }

            // Then add all other categories
            blocksData.categories.forEach(cat => {
                if (cat.slug !== 'advgb-category') {
                    cats[cat.slug] = {
                        title: cat.title,
                        blocks: []
                    };
                }
            });

            // Assign blocks to categories
            blocksData.blocks.forEach(block => {
                const catSlug = block.category || 'common';
                if (!cats[catSlug]) {
                    cats[catSlug] = {
                        title: block.categoryTitle || catSlug,
                        blocks: []
                    };
                }
                cats[catSlug].blocks.push(block);
            });

            return cats;
        }, [blocksData.categories, blocksData.blocks]);

        const filteredCategories = useMemo(() => {
            if (showEmptyBlocks) return categories;

            const filtered = {};
            Object.entries(categories).forEach(([slug, category]) => {
                const filteredBlocks = category.blocks.filter(bt => {
                    return data.usage[bt.name] && Object.keys(data.usage[bt.name].posts).length > 0;
                });

                if (filteredBlocks.length > 0) {
                    filtered[slug] = {
                        ...category,
                        blocks: filteredBlocks
                    };
                }
            });

            return filtered;
        }, [categories, data.usage, showEmptyBlocks]);

        useEffect(() => {
            if (!selected && blocksData.blocks.length > 0 && initialLoadComplete) {
                const firstCategory = Object.values(filteredCategories)[0];
                if (firstCategory && firstCategory.blocks.length > 0) {
                    setSelected(firstCategory.blocks[0]);
                }
            }
        }, [filteredCategories, blocksData.blocks, initialLoadComplete]);

        const scanAll = async () => {
            setLoadingAll(true);
            setScanProgress({
                current: 0,
                total: 0,
                status: __('Initializing scan...', 'advanced-gutenberg'),
                completed: false
            });

            try {
                let offset = 0;
                const batchSize = 20;
                let newData = {
                    usage: {},
                    posts: [],
                    lastScanDate: ''
                };
                let totalPosts = 0;
                let hasMorePosts = true;

                while (hasMorePosts) {
                    setScanProgress(prev => ({
                        ...prev,
                        status: sprintf(
                            __('Processing posts (%1$s/%2$s)', 'advanced-gutenberg'),
                            offset.toLocaleString(),
                            totalPosts.toLocaleString()
                        )
                    }));

                    const batchResponse = await postAjax('pp_blocks-usage_scan_batch', {
                        offset,
                        batch_size: batchSize,
                        post_types: selectedPostTypes
                    });

                    if (!batchResponse.success) {
                        throw new Error(__('Batch scan failed', 'advanced-gutenberg'));
                    }

                    if (batchResponse.data.total) {
                        totalPosts = batchResponse.data.total;
                    }

                    // Merge usage data
                    Object.entries(batchResponse.data.usage || {}).forEach(([blockName, blockData]) => {
                        if (!newData.usage[blockName]) {
                            newData.usage[blockName] = {
                                posts: {},
                                total: 0
                            };
                        }

                        Object.entries(blockData.posts || {}).forEach(([postId, entry]) => {
                            newData.usage[blockName].posts[postId] = entry;
                        });

                        newData.usage[blockName].total += blockData.total || 0;
                    });

                    // Merge posts
                    newData.posts = [...newData.posts, ...(batchResponse.data.posts || [])];
                    newData.lastScanDate = batchResponse.data.lastScanDate || newData.lastScanDate;

                    offset += batchResponse.data.processed || 0;
                    hasMorePosts = offset < totalPosts;

                    setScanProgress(prev => ({
                        ...prev,
                        current: offset,
                        total: totalPosts
                    }));

                    // Update local state with the new data
                    setData(newData);

                    // Save to IndexedDB after each batch
                    try {
                        await saveToCache('block_usage_data', newData);
                    } catch (error) {
                        console.error('Failed to save batch to IndexedDB:', error);
                        // Continue with next batch even if save fails
                    }

                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                setScanProgress(prev => ({
                    ...prev,
                    completed: true,
                    status: __('Scan completed successfully!', 'advanced-gutenberg')
                }));
            } catch (error) {
                console.error('Scan error:', error);
                setScanProgress(prev => ({
                    ...prev,
                    status: __('Scan failed: ', 'advanced-gutenberg') + error.message
                }));
            } finally {
                setTimeout(() => {
                    setLoadingAll(false);
                    setScanProgress({
                        current: 0,
                        total: 0,
                        status: '',
                        completed: false
                    });
                }, 2000);
            }
        };

        const clearAllData = async () => {
            setLoadingClearAll(true);
            try {
                await clearCache();
                setData({
                    usage: {},
                    posts: [],
                    lastScanDate: ''
                });
                setShowEmptyBlocks(false);
                setSelected(null);

                // Clear settings as well
                await saveToCache('block_usage_settings', {
                    showEmptyBlocks: false,
                    lastSelectedBlock: ''
                });
            } catch (error) {
                console.error('Failed to clear data:', error);
                setDbError(__('Failed to clear data. Please try again.', 'advanced-gutenberg'));
            } finally {
                setLoadingClearAll(false);
            }
        };

        const handleDetailsClick = async (bt) => {
            const newSelected = selected?.name === bt.name ? null : bt;
            setSelected(newSelected);

            // Save the last selected block
            if (newSelected) {
                try {
                    await saveToCache('block_usage_settings', {
                        showEmptyBlocks,
                        lastSelectedBlock: newSelected.name
                    });
                } catch (error) {
                    console.error('Failed to save last selected block:', error);
                }
            }
        };

        if (!initialLoadComplete) {
            return (
                <div className="pp-blocks-usage-wrapper">
                    <div className="advgb-block-feature-loading-msg" style={{ display: 'block' }}>
                        {__('Loading...', 'advanced-gutenberg')} <Spinner />
                    </div>
                </div>
            );
        }

        return (
            <div className={`pp-blocks-usage-wrapper ${selected ? 'has-sidebar' : ''}`}>
                {dbError && (
                    <Notice status="error" onRemove={() => setDbError(null)}>
                        {dbError}
                    </Notice>
                )}

                <div className="pp-blocks-usage-header">
                    <Flex justify="space-between" align="center">
                        <FlexItem>
                            <div className="pp-blocks-usage-controls">
                                {window.advgb_block_usage_data?.postTypes && (
                                    <div className="pp-blocks-usage-post-type-selector">
                                        <FormTokenField
                                            label={__('Limit Scan to Post Types:', 'advanced-gutenberg')}
                                            value={selectedPostTypes}
                                            suggestions={Object.keys(window.advgb_block_usage_data.postTypes)}
                                            onChange={(newPostTypes) => handlePostTypeChange(newPostTypes)}
                                            displayTransform={(postType) => window.advgb_block_usage_data.postTypes[postType] || postType}
                                            tokenizeOnSpace={false}
                                            __experimentalExpandOnFocus={true}
                                            __experimentalShowHowTo={false}
                                            style={{ minWidth: '300px' }}
                                        />
                                    </div>
                                )}
                                <Button variant="primary" onClick={scanAll} disabled={loadingAll}>
                                    {loadingAll ? <Spinner /> : __('Scan Block Usage', 'advanced-gutenberg')}
                                </Button>
                            </div>
                        </FlexItem>
                        <FlexItem>
                            <div className="advgb-toggle-wrapper">
                                {__('Show Empty Blocks', 'advanced-gutenberg')}
                                <div className="advgb-switch-button">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="toggle_empty_blocks"
                                            id="toggle_empty_blocks"
                                            checked={showEmptyBlocks}
                                            onChange={(e) => handleToggleChange(e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </FlexItem>
                    </Flex>
                </div>

                {loadingAll && (
                    <div className="scan-progress-container">
                        <div className="scan-progress">
                            <p>{scanProgress.status}</p>
                            <div className="progress-wrap"><ProgressBar
                                value={scanProgress.total > 0 ? (scanProgress.current / scanProgress.total) * 100 : 0}
                            /></div>
                        </div>
                    </div>
                )}

                {data.lastScanDate && (
                    <div className="pp-blocks-usage-last-scan">
                        <span>{__('Last scan:', 'advanced-gutenberg')} {new Date(data.lastScanDate).toLocaleString()}</span>
                        <div className="ppb-tooltips-library" data-toggle="ppbtooltip" data-placement="left">
                            {!loadingClearAll &&
                                <span className="dashicons dashicons-editor-help" style={{ verticalAlign: 'middle', lineHeight: 'inherit' }}></span>
                            }
                            <Button
                                variant="secondary"
                                onClick={clearAllData}
                                disabled={loadingAll || loadingClearAll}
                                className="is-destructive"
                                style={{ marginLeft: '8px' }}
                            >
                                {loadingClearAll ? <Spinner /> : __('Clear All Data', 'advanced-gutenberg')}
                            </Button>
                            {!loadingClearAll &&
                                <span className="tooltip-text">
                                    <span>{__('Scan data is stored in your browser to improve performance and handle large datasets. This keeps your WordPress database clean. Click to permanently delete all stored data.', 'advanced-gutenberg')}</span>
                                    <i></i>
                                </span>
                            }
                        </div>
                    </div>
                )}

                <div className="pp-blocks-usage-container">
                    <div className="pp-blocks-usage-categories">
                        {Object.entries(filteredCategories).map(([slug, { title, blocks }]) => (
                            <PanelBody key={slug} title={title} initialOpen>
                                <div className="pp-blocks-usage-block-grid">
                                    {blocks.map(bt => {
                                        const hasData = data.usage[bt.name] && Object.keys(data.usage[bt.name].posts).length > 0;
                                        const blockData = data.usage[bt.name] || { posts: {}, total: 0 };
                                        const postCount = Object.keys(blockData.posts).length;
                                        const useCount = blockData.total;
                                        const lastScanned = Object.values(blockData.posts)[0]?.scanned || '';

                                        return (
                                            <Card
                                                key={bt.name}
                                                className={`pp-blocks-usage-block-tile ${selected?.name === bt.name ? 'active' : ''}`}
                                                onClick={() => handleDetailsClick(bt)}
                                            >
                                                <div className="pp-blocks-usage-tile-main">
                                                    {bt.icon && (
                                                        <span className="block-icon" style={bt.iconColor ? { color: bt.iconColor } : {}}>
                                                            {typeof bt.icon === 'string' && !bt.icon.includes('<') ? (
                                                                <span className={`dashicons dashicons-${bt.icon}`}></span>
                                                            ) : (
                                                                <span dangerouslySetInnerHTML={{ __html: bt.icon }} />
                                                            )}
                                                        </span>
                                                    )}
                                                    <span>{bt.title}</span>
                                                </div>
                                                {hasData ? (
                                                    <div className="pp-blocks-usage-tile-counts">
                                                        <div>{__('Locations:', 'advanced-gutenberg')} {postCount}</div>
                                                        <div>{__('Instances:', 'advanced-gutenberg')} {useCount}</div>
                                                    </div>
                                                ) : (
                                                    <div className="pp-blocks-usage-tile-counts">
                                                        <div className="no-scan">
                                                            {data.lastScanDate
                                                                ? __('Not found in any posts', 'advanced-gutenberg')
                                                                : __('No scan history', 'advanced-gutenberg')}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="pp-blocks-usage-tile-actions">
                                                    <Button variant="secondary" size="small" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDetailsClick(bt);
                                                    }}>
                                                        {__('Details', 'advanced-gutenberg')}
                                                    </Button>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </PanelBody>
                        ))}
                    </div>

                    {selected && (
                        <Sidebar
                            key={selected.name}
                            selected={selected}
                            data={data}
                            onClose={() => setSelected(null)}
                            canEditPosts={currentUser?.canEditPosts || false}
                        />
                    )}
                </div>
            </div>
        );
    };

    // Only render the app if wp.blocks is available
    if (typeof wp !== 'undefined' && typeof wp.blocks !== 'undefined') {
        render(<App />, document.getElementById('advgb-block-usage-app'));
    } else {
        const appContainer = document.getElementById('advgb-block-usage-app');
        if (appContainer) {
            appContainer.innerHTML = '<p>' + __('Error Loading blocks data...', 'advanced-gutenberg') + '</p>';
        }
    }

})(wp.i18n, wp.hooks, wp.blocks, wp.blockEditor, wp.components, wp.compose, wp.element);