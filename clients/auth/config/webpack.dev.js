const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.resolve(__dirname, '../.env.development'),
});
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
    }),
  ],
  output: {
    publicPath: 'http://localhost:3005/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  devServer: { port: 3005, historyApiFallback: true },
});
