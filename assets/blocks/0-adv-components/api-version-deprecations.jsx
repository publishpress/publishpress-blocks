const { addFilter } = wp.hooks;

const getDefaultBlockClassName = (blockName) => {
    if (wp.blocks && typeof wp.blocks.getBlockDefaultClassName === 'function') {
        return wp.blocks.getBlockDefaultClassName(blockName);
    }

    return `wp-block-${blockName.replace('/', '-')}`;
};

const addDefaultBlockClassName = (element, blockName) => {
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
    const classNames = className.split(/\s+/).filter(Boolean);

    if (classNames.indexOf(defaultClassName) !== -1) {
        return element;
    }

    return wp.element.cloneElement(element, {
        className: [defaultClassName, className].filter(Boolean).join(' '),
    });
};

addFilter('blocks.registerBlockType', 'advgb/addApiV1Deprecations', function (settings, name) {
    const blockName = settings ? name || settings.name : name;

    if (!settings || typeof blockName !== 'string' || blockName.indexOf('advgb/') !== 0) {
        return settings;
    }

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

    if (!settings.__advgbUsesSaveBlockClass) {
        const save = settings.save;

        settings.save = function AdvgbBlockSaveWithDefaultClass(props) {
            return addDefaultBlockClassName(save.apply(this, arguments), blockName);
        };
        settings.__advgbUsesSaveBlockClass = true;
    }

    return settings;
});
