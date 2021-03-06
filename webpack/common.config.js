const path = require('path');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, '../static'),
    build: path.join(__dirname, '../services/webapi/src/main/resources/templates')
};

const VENDOR = [
    'history',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-mixin',
    'classnames',
    'redux',
    'react-router-redux',
];

const basePath = path.resolve(__dirname, '../static/');

const common = {
    context: basePath,
    entry: {
        vendor: VENDOR,
        app: ['babel-polyfill',PATHS.app]
    },
    output: {
        filename: '[name].[hash].js',
        path: PATHS.build,
        publicPath: '/'
    },
    plugins: [
        // extract all common modules to vendor so we can load multiple apps in one page
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     filename: 'vendor.[hash].js'
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            async: true,
            minChunks: 2
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.scss$/,
            options: {
                postcss: [
                    autoprefixer({ browsers: ['last 2 versions'] })
                ],
                sassLoader: {
                    data: `@import "${__dirname}/../static/styles/config/_variables.scss";`
                }
            }
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.css$/,
            options: {
                postcss: [
                    autoprefixer({ browsers: ['last 2 versions'] })
                ]
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../static/index.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: TARGET === 'dev' ? '"development"' : '"production"' },
            '__DEVELOPMENT__': TARGET === 'dev'
        }),
        new CleanWebpackPlugin([PATHS.build], {
            root: process.cwd()
        })
    ],
    resolve: {
        extensions: ['.jsx', '.js', '.json', '.scss', '.css'],
        modules: ['node_modules']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    { loader: 'babel-loader' }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$/,
                loader: 'file-loader?name=/images/[name].[ext]?[hash]'
            },
            {
                test: /\.woff(\?.*)?$/,
                loader: 'url-loader?name=/fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.woff2(\?.*)?$/,
                loader: 'url-loader?name=/fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2'
            },
            {
                test: /\.ttf(\?.*)?$/,
                loader: 'url-loader?name=/fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?.*)?$/,
                loader: 'file-loader?name=/fonts/[name].[ext]'
            },
            {
                test: /\.otf(\?.*)?$/,
                loader: 'file-loader?name=/fonts/[name].[ext]&mimetype=application/font-otf'
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'url-loader?name=/fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.json(\?.*)?$/,
                loader: 'file-loader?name=/files/[name].[ext]'
            }
        ]
    },
};

switch (TARGET) {
    case 'dev':
        module.exports = merge(require('./dev.config'), common);
        break;
    case 'prod':
        module.exports = merge(require('./prod.config'), common);
        break;
    default:
	module.exports = merge(require('./dev.config'), common);
        break;
        console.log('Target configuration not found. Valid targets: "dev" or "prod".');
}
