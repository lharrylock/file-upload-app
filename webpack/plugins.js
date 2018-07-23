const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const BASE_PLUGINS = [
    new ForkTsCheckerWebpackPlugin({
        tsconfig: path.resolve(__dirname, '../', 'tsconfig.json'),
        // tslint: path.resolve(__dirname, '../', 'tslint.json'),
        workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
    }),
    new CleanWebpackPlugin(['dist'], {
        root: path.resolve(__dirname, '../'),
        watch: true,
    }),
    // new ExtractTextPlugin('style.[contenthash].css'),
    // new optimization.splitChunks({
    //     name: 'vendor',
    //     minChunks(module) {
    //         return module.context && module.context.indexOf('node_modules') !== -1;
    //     }
    // }),
    // new optimization.splitChunks({
    //     name: 'runtime'
    // }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.template.html')
    })
];


const BUNDLE_ANALYZER = [new BundleAnalyzerPlugin({ analyzerMode: 'static' })];

module.exports = (env, analyzer) => [
    ...BASE_PLUGINS,
    ...(analyzer ? BUNDLE_ANALYZER : []),
    // ...(PLUGINS_BY_ENV[env] || [])
];