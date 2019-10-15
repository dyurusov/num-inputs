const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'num-inputs.js',
    library: 'numInputs'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'numInputs',
      template: path.resolve(__dirname, '../src/index.html'),
    }),
  ],
};