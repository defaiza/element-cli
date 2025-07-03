"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackConfig = getWebpackConfig;
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
function getWebpackConfig(options) {
    const { mode, projectDir, hot = false, port = 3000, analyze = false, sourceMaps = false, minify = true } = options;
    const isDevelopment = mode === 'development';
    const isProduction = mode === 'production';
    // Determine entry point
    const entryPath = path_1.default.join(projectDir, 'src');
    const hasTsx = require('fs').existsSync(path_1.default.join(entryPath, 'index.tsx'));
    const hasJsx = require('fs').existsSync(path_1.default.join(entryPath, 'index.jsx'));
    const hasTs = require('fs').existsSync(path_1.default.join(entryPath, 'index.ts'));
    const hasJs = require('fs').existsSync(path_1.default.join(entryPath, 'index.js'));
    let entry = '';
    if (hasTsx)
        entry = path_1.default.join(entryPath, 'index.tsx');
    else if (hasJsx)
        entry = path_1.default.join(entryPath, 'index.jsx');
    else if (hasTs)
        entry = path_1.default.join(entryPath, 'index.ts');
    else if (hasJs)
        entry = path_1.default.join(entryPath, 'index.js');
    else
        throw new Error('No entry point found in src/');
    const config = {
        mode,
        entry: isDevelopment && hot ? [
            `webpack-dev-server/client?http://localhost:${port}`,
            'webpack/hot/only-dev-server',
            entry
        ] : entry,
        output: {
            path: path_1.default.join(projectDir, 'dist'),
            filename: isProduction ? '[name].[contenthash].js' : '[name].js',
            chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
            publicPath: '/',
            clean: true
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
            alias: {
                '@': path_1.default.join(projectDir, 'src')
            }
        },
        module: {
            rules: [
                // TypeScript/JavaScript
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: isDevelopment,
                            configFile: path_1.default.join(projectDir, 'tsconfig.json')
                        }
                    }
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { targets: 'defaults' }],
                                ['@babel/preset-react', { runtime: 'automatic' }]
                            ]
                        }
                    }
                },
                // CSS
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: sourceMaps,
                                modules: {
                                    auto: true,
                                    localIdentName: isDevelopment ? '[name]__[local]' : '[hash:base64:8]'
                                }
                            }
                        }
                    ]
                },
                // Assets
                {
                    test: /\.(png|jpe?g|gif|svg|ico)$/,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8 * 1024 // 8kb
                        }
                    }
                },
                // Fonts
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource'
                }
            ]
        },
        plugins: [
            new html_webpack_plugin_1.default({
                template: path_1.default.join(projectDir, 'public/index.html'),
                filename: 'index.html',
                inject: true,
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                } : false
            }),
            // Environment variables
            new webpack_1.default.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
                'process.env.DEFAI_ELEMENT': JSON.stringify(true)
            }),
            // Hot module replacement
            ...(isDevelopment && hot ? [new webpack_1.default.HotModuleReplacementPlugin()] : [])
        ],
        devtool: sourceMaps ? (isDevelopment ? 'eval-source-map' : 'source-map') : false,
        optimization: {
            minimize: isProduction && minify,
            splitChunks: isProduction ? {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            } : false
        },
        performance: {
            hints: isProduction ? 'warning' : false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    };
    // Development server configuration
    if (isDevelopment) {
        config.devServer = {
            host: 'localhost',
            port,
            hot,
            compress: true,
            historyApiFallback: true,
            static: {
                directory: path_1.default.join(projectDir, 'public'),
                publicPath: '/'
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            }
        };
    }
    // Bundle analyzer
    if (analyze) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins?.push(new BundleAnalyzerPlugin());
    }
    return config;
}
//# sourceMappingURL=webpack.config.js.map