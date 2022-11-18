const { merge } = require('webpack-merge');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.resolve(__dirname, '../.env.development'),
});

module.exports = merge(commonConfig, {
  mode: 'development',
  output: { publicPath: '/' },
  devServer: { port: 3004, historyApiFallback: true },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      filename: 'remoteEntry.js',
      exposes: {},
      remotes: { auth: 'auth@http://localhost:3005/remoteEntry.js' },
      shared: packageJson.dependencies,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
    }),
  ],
});
