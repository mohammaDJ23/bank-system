const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const packageJson = require('../package.json');

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new ModuleFederationPlugin({
      name: 'container',
      filename: 'remoteEntry.js',
      exposes: {},
      remotes: {
        auth: 'auth@http://localhost:3005/remoteEntry.js',
        bank: 'bank@http://localhost:3006/remoteEntry.js',
      },
      shared: packageJson.dependencies,
    }),
  ],
  output: {
    publicPath: 'http://localhost:3004/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  devServer: { port: 3004, historyApiFallback: true },
};
