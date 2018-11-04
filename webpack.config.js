const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const dist = './docs';

const plugins = ['index', 'player'].map(fileName => (
  new HtmlWebpackPlugin({
    inject: false,
    template: `view/${fileName}.pug`,
    filename: `${fileName}.html`,
    minify: {
      html5: true,
      removeComments: true,
      useShortDoctype: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
    },
  })
))

module.exports = {
  mode: 'production',

  optimization: {
    minimize: true,
  },

  entry: {
    index: './js/index.js',
    player: './js/player.js',
    style: './scss/style.scss',
    video: './scss/video.scss',
  },

  output: {
    path: path.resolve(__dirname, dist),
    filename: 'js/[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ]
      },

      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },

      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      },
    ],
  },

  devServer: {
    index: 'index.html',
    contentBase: dist,
  },

  plugins: [
    new CleanWebpackPlugin(dist),

    ...plugins,

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    new HtmlWebpackExcludeAssetsPlugin(),

    new CopyWebpackPlugin([
      {from: './assets', to: './assets'}
    ]),
  ]
};

