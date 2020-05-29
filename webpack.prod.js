const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',

  output: {
    libraryTarget: "umd",
    library: "pages",
    path: path.join(__dirname, "dist"),
    filename: "pages.[name].js"
  },

  plugins: [
    new CleanWebpackPlugin()
  ]
});
