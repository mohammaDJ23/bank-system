const path = require('path');
const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    publicPath: 'http://localhost:3004/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  devServer: { port: 3004, historyApiFallback: true },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      filename: 'remoteEntry.js',
      exposes: {},
      remotes: { auth: 'auth@http://localhost:3005/remoteEntry.js' },
      shared: packageJson.dependencies,
    }),
  ],
});
