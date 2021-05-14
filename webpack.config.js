'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "http://localhost:8080/public/",
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader",
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],
};
