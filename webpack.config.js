// import path from "path";
// import HtmlWebpackPlugin from "html-webpack-plugin";

const path = require('path');
// import path, { dirname } from "path";
const HtmlWebpackPlugin = require('html-webpack-plugin');
// import HtmlWebpackPlugin from "html-webpack-plugin";

// import { fileURLToPath } from 'url';
// import  from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

module.exports = {
  mode: 'development',
  entry: {
    utils: {
      import: "./lib/utils.js"
    },
    lib: {
      import: "./lib/component.js",
      dependOn: "utils"
    },
    // parent: {
    //   import: './parent.cssm.js',
    //   dependOn: ["root", "parentRender"]
    // },
    // parentRender: {
    //   import: './parent.rcssm.js',
    //   // dependOn: "parent"
    // },
    
    rootRender: {
      import: './root.rcssm.js',
      // dependOn: "root"
    },
    root: {
      import: './root.cssm.js',
      dependOn: ["lib", "rootRender"]
    },
    // index: {
    //   import: "./index.js",
    //   dependOn: ["root", "parent"]
    // }
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
              mode: "js"
            },
          },
        ],
      },
      {
        test: /\.rcssm\.js$/,
        use: [
          {
            loader: path.resolve('./lib/cssm-loader.js'),
            options: {
              mode: "html"
            }
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ],
  },
};

// to-do: CSS https://www.npmjs.com/package/sass
// to-do: mix with React components or apps