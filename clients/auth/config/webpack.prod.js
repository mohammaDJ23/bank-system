const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  entry: './src/index.ts',
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: 'http://localhost:3005/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  devServer: {
    port: 3005,
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
