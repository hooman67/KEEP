const webpack = require('webpack');
const path = require('path');
const config = require('config');
const fs = require('fs');

if (!fs.existsSync(path.resolve(__dirname, 'config/dist/'))) {
  fs.mkdirSync(path.resolve(__dirname, 'config/dist/'));
}
fs.writeFileSync(path.resolve(__dirname, 'config/dist/client.json'), JSON.stringify(config));

module.exports = {
  devtool: 'source-map',

  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr',
    'whatwg-fetch',
    'babel-polyfill',
    './client/src/index.tsx',
  ],

  output: {
    filename: 'app.js',
    publicPath: '/dist',
    path: path.resolve('dist/client')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.css', '.js'],
    alias: {
      config: path.resolve(__dirname, 'config/dist/client.json')
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: path.resolve(__dirname, 'client/tsconfig.json'),
            useBabel: true,
            babelOptions: {
              presets: ['es2015', 'stage-1', 'react'],
              plugins: [ "react-hot-loader/babel" ]
            },
            useCache: true
          }
        }]
      },

      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, './client'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
