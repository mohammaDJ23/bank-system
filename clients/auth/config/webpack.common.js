const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(png|jpe?g|gif|woff|svg|eot|ttf)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.scss|\.css$/,
        use: [
          // 'vue-style-loader',
          'style-loader',
          { loader: 'css-loader', options: { modules: true } },
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({ __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: true }),
  ],
};
