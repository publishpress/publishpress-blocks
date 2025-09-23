var glob = require("glob");
var path = require("path");

module.exports = [
    {
        entry: glob.sync(
            "./assets/**/*.jsx",
            {ignore: [
                "./assets/blocks/customstyles/*.jsx",
                "./assets/blocks/block-controls/*.jsx",
                "./assets/blocks/block-usage/*.jsx",
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
            "./assets/blocks/block-controls/block-controls.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "block-controls.js"
        },
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
            "./assets/blocks/block-controls/preset-manager.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "preset-manager.js"
        },
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
            "./assets/blocks/block-controls/preset-data-manager.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "preset-data-manager.js"
        },
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
            "./assets/blocks/block-usage/block-usage.jsx",
            ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "blocks"),
            filename: "block-usage.js"
        },
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
