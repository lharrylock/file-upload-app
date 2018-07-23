const path = require('path');
const getPluginsByEnv = require('./plugins');
const tsImportPluginFactory = require('ts-import-plugin');

module.exports = ({ analyze, env } = {}) => ({
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        filename: '[name].[chunkhash].js'
    },
    devServer: {
      contentBase: path.join(__dirname, '../', 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                include: [
                    path.resolve(__dirname, '../', 'src')
                ],
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, '../', 'tsconfig.json'),
                        compilerOptions: {
                            noEmit: false,
                        },
                        getCustomTransformers: () => ({
                            before: [
                                tsImportPluginFactory([
                                    {
                                        libraryName: 'lodash',
                                        libraryDirectory: null,
                                        camel2DashComponentName: false,
                                        style: false,
                                    }
                                ]),
                            ]
                        }),
                        // give responsibility of type checking to fork-ts-checker-webpack-plugin
                        // in order to speed up build times
                        transpileOnly: true,
                    }
                }
            }
        ]
    },
    plugins: getPluginsByEnv(env, analyze),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    mode: 'development'
});