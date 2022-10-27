const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');
const path = require('path');

module.exports = merge(commonConfig, {
  entry: './src/index.ts',
  mode: 'development',
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    poll: true,
    aggregateTimeout: 600,
    ignored: /node_modules/,
  },
  output: {
    publicPath: 'http://localhost:3004/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  devServer: {
    port: 3004,
    open: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthApp': './src/bootstrap',
      },
      shared: packageJson.dependencies,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
});
