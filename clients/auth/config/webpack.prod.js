const { merge } = require('webpack-merge');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: '/root/config/c-auth.env.txt',
});
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
    }),
  ],
});
