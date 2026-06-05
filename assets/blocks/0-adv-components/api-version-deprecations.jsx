const { addFilter } = wp.hooks;

addFilter('blocks.registerBlockType', 'advgb/addApiV1Deprecations', function (settings, name) {
    const blockName = settings ? name || settings.name : name;

    if (!settings || typeof blockName !== 'string' || blockName.indexOf('advgb/') !== 0) {
        return settings;
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

    return settings;
});
