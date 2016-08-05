const webpack = require('webpack');

module.exports = {
  entry: './src/index.coffee',
  output: {
    path: './',
    filename: 'index.js',
  },
  watch: true,
  debug: true,
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee' },
    ],
  },
  resolve: {
    extensions: ['', '.web.coffee', '.web.js', '.coffee', '.js'],
  },
};
