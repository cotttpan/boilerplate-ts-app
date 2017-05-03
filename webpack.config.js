const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NotifierPlugin = require('webpack-notifier');
const BabiliPlugin = require('babili-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

// ------------------------------------------------
// env
// ------------------------------------------------
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const isDev = !isProd;

// ------------------------------------------------
// common config
// ------------------------------------------------
const common = {
    entry: {
        app: ['./src/index.ts', './src/index.css']
    },
    output: {
        path: path.join(__dirname, 'dist', 'assets'),
        filename: '[name].bundle.js',
        publicPath: '/assets/'
    },
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                exclude: /(\/node_modules\/|\.test\.tsx?$)/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new NotifierPlugin({ title: 'Webpack' }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat'
        }
    }
};

// ------------------------------------------------
// dev config
// ------------------------------------------------
const dev = merge.strategy({ entry: 'prepend' })(common, {
    devtool: 'inline-source-map',
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server'
        ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?importLoaders=1',
                    'postcss-loader'
                ]
            }
        ]
    },
    devServer: {
        contentBase: 'dist',
        publicPath: '/assets/',
        hot: true,
        noInfo: true,
        historyApiFallback: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});

// ------------------------------------------------
// prod config
// ------------------------------------------------
const prod = merge(common, {
    devtool: 'hidden-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?importLoaders=1&minimize',
                        'postcss-loader'
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].bundle.css'
        }),
        new BabiliPlugin()
    ]
});


module.exports = isProd ? prod : dev;

