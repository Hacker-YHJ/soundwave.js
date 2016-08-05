const webpack = require('webpack');

module.exports = {
  entry: './src/index.coffee',
  output: {
    path: './',
    filename: 'index.js',
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee' },
    ],
  },
  resolve: {
    extensions: ['', '.web.coffee', '.web.js', '.coffee', '.js'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      mangle: true,
    }),
  ],
};
