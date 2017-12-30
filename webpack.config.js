const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './client/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './assets/js'),
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      query: {
        plugins:  [
          ['transform-react-jsx', {
            'pragma': 'h'
          }]
        ],
      },
      include:  [path.resolve(__dirname, './')],
      exclude: /node_modules/,
    }],
  },
  plugins: [],
}
