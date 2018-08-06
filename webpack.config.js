/* https://github.com/zinserjan/mocha-webpack/blob/master/docs/installation/webpack-configuration.md */
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'none',

  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },

  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      loader: 'babel-loader',
    }],
  },

  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.json'],
  },

  devtool: 'inline-cheap-module-source-map',
  target: 'node',
  externals: [nodeExternals()],
}
