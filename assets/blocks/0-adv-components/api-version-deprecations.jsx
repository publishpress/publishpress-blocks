const { addFilter } = wp.hooks;

// Resolve the default wrapper class Gutenberg expects for a block, e.g. wp-block-advgb-table.
const getDefaultBlockClassName = (blockName) => {
    if (wp.blocks && typeof wp.blocks.getBlockDefaultClassName === 'function') {
        return wp.blocks.getBlockDefaultClassName(blockName);
    }

    return `wp-block-${blockName.replace('/', '-')}`;
};

// API v3 no longer injects wrapper classes into save markup for these legacy saves.
// Preserve each block's existing root element and add the default and custom classes when missing.
const addSaveBlockClassNames = (element, blockName, customClassName = '') => {
    if (
        !wp.element
        || typeof wp.element.isValidElement !== 'function'
        || typeof wp.element.cloneElement !== 'function'
        || !wp.element.isValidElement(element)
        || element.type === wp.element.Fragment
    ) {
        return element;
    }

    const defaultClassName = getDefaultBlockClassName(blockName);
    const className = element.props && element.props.className ? element.props.className : '';
    const classNames = [
        defaultClassName,
        className,
        customClassName,
    ]
        .join(' ')
        .split(/\s+/)
        .filter((value, index, self) => value && self.indexOf(value) === index);

    if (classNames.join(' ') === className) {
        return element;
    }

    return wp.element.cloneElement(element, {
        className: classNames.join(' '),
    });
};

// Centralize API v3 compatibility fixes so individual block files do not need duplicate wrappers.
addFilter('blocks.registerBlockType', 'advgb/addApiV1Deprecations', function (settings, name) {
    const blockName = settings ? name || settings.name : name;

    if (!settings || typeof blockName !== 'string' || blockName.indexOf('advgb/') !== 0) {
        return settings;
    }

    // Class edit components cannot call useBlockProps(), so wrap them with a function component.
    // This restores editor selection data attributes and toolbar click handling for API v3 blocks.
    if (settings.apiVersion === 3 && typeof settings.edit === 'function' && !settings.__advgbUsesBlockProps) {
        const Edit = settings.edit;
        const getEditWrapperProps = settings.getEditWrapperProps;

        settings.edit = function AdvgbBlockEditWithProps(props) {
            const wrapperProps = typeof getEditWrapperProps === 'function'
                ? getEditWrapperProps(props.attributes)
                : {};
            const blockEditor = wp.blockEditor || wp.editor;
            const blockProps = blockEditor && typeof blockEditor.useBlockProps === 'function'
                ? blockEditor.useBlockProps(wrapperProps)
                : wrapperProps;

            return (
                <div {...blockProps}>
                    <Edit {...props} />
                </div>
            );
        };
        settings.__advgbUsesBlockProps = true;
    }

    if (settings.apiVersion !== 3 || typeof settings.save !== 'function') {
        return settings;
    }

    // Keep the pre-wrapper save available so existing post content remains valid after migration.
    const deprecated = Array.isArray(settings.deprecated)
        ? settings.deprecated.map((deprecation) => ({
            ...deprecation,
            apiVersion: deprecation.apiVersion || 1,
        }))
        : [];

    settings.deprecated = [
        {
            apiVersion: 1,
            attributes: settings.attributes,
            supports: settings.supports,
            save: settings.save,
        },
        ...deprecated,
    ];

    // Ensure new API v3 saves include the default wp-block-* class expected in stored markup.
    if (!settings.__advgbUsesSaveBlockClass) {
        const save = settings.save;

        settings.save = function AdvgbBlockSaveWithDefaultClass(props) {
            const customClassName = props && props.attributes ? props.attributes.className : '';

            return addSaveBlockClassNames(save.apply(this, arguments), blockName, customClassName);
        };
        settings.__advgbUsesSaveBlockClass = true;
    }

    return settings;
});
