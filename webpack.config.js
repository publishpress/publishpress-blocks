var glob = require("glob");
var path = require("path");

const i18nExternals = { '@wordpress/i18n': 'wp.i18n' };

module.exports = [
    {
        entry: glob.sync(
            "./assets/**/*.jsx",
            {ignore: [
                "./assets/blocks/customstyles/*.jsx",
                "./assets/pages/block-controls/*.jsx",
                "./assets/pages/block-usage/*.jsx",
                "./assets/blocks/pro-ad/*.jsx",
                "./assets/blocks/editor-sidebar/*.jsx",
                "./assets/blocks/**/*.frontend.jsx",
                "./assets/js/editor.jsx"
            ]}
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "blocks.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync(
            "./assets/blocks/customstyles/custom-styles.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "custom-styles.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync(
            "./assets/blocks/pro-ad/pro-ad.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "pro-ad.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync(
            "./assets/blocks/editor-sidebar/post-sidebar.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "post-sidebar.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync(
            "./assets/pages/block-controls/block-controls.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "pages"),
            filename: "block-controls.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync(
            "./assets/pages/block-controls/preset-manager.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "pages"),
            filename: "preset-manager.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync(
            "./assets/pages/block-controls/preset-data-manager.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "pages"),
            filename: "preset-data-manager.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync(
            "./assets/pages/block-usage/block-usage.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "pages"),
            filename: "block-usage.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync("./assets/**/*.frontend.jsx"),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "frontend.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(frontend.jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: /(node_modules|bower_components)/ // JavaScript files to be ignored.
                }
            ]
        }
    },
    {
        entry: glob.sync(
            "./assets/js/editor.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "editor.js"
        },
        externals: i18nExternals,
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        }
    }
];
