const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  devServer: { port: 3004 },
  mode: 'development',
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: { auth: `auth@http://localhost:3005/remoteEntry.js` },
      shared: packageJson.dependencies,
    }),
  ],
});
