const { merge } = require('webpack-merge');
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
  ],
});