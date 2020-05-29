const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',

  devtool: 'inline-source-map',

  output: {
    libraryTarget: "umd",
    library: "pages",
    path: path.join(__dirname, "public/pages/js"),
    filename: "pages.[name].js"
  },

  plugins: [
    new CleanWebpackPlugin()
  ],

  devServer: {
    contentBase: './public'
  }
});