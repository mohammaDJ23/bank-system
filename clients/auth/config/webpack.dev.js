const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.resolve(__dirname, '../.env.development'),
});
const { ModuleFederationPlugin } = require('webpack').container;
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  output: { publicPath: 'http://localhost:3005/' },
  devServer: { port: 3005, historyApiFallback: true },
  plugins: [
    new ModuleFederationPlugin({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: { './AuthApp': './src/main.js' },
      shared: packageJson.dependencies,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
    }),
  ],
});
