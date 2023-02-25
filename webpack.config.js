// import path from "path";
// import HtmlWebpackPlugin from "html-webpack-plugin";

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    lib: {
      import: "./lib/component.js"
    },
    components: {
      import: './example.cssm.js',
      dependOn: "lib"
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack - React-like',
      template: 'public/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.cssm\.js$/,
        use: [
          {
            loader: path.resolve('./lib/cssm-loader.js'),
            options: {
              /* ... */
            },
          },
        ],
      },
    ],
  },
};
