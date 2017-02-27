var webpack = require('webpack');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var _ = require('lodash');
var path = require('path');

var config = module.exports = require('./main.config.js');

config.output = _.merge(config.output, {
  path: path.join(config.context, 'public', 'assets'), // asset_prefix
  publicPath: '/assets/',
  filename: '[name]-bundle-[chunkhash].js',
  chunkFilename: '[id]-bundle-[chunkhash].js'
});

config.plugins.push(
  //new webpack.optimize.CommonsChunkPlugin('common', 'common-[chunkhash].js'),
  new ExtractTextPlugin("[name]-bundle-[chunkhash].css"),
  new ChunkManifestPlugin({
    filename: 'webpack-common-manifest.json',
    manifestVariable: 'webpackManifest'
  }),
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),

  // Everything else **first**.
  // Called with webpack.rake
  new StatsWriterPlugin({
    filename: 'webpack-asset-manifest.json',
    transform: function(data) {
      var assetsByChunkName = data.assetsByChunkName;
      Object.keys(assetsByChunkName).forEach(function(key) {
        var value = assetsByChunkName[key];
        if (Array.isArray(value)) {
          value = value.filter(function(v) { return v.match(/\.(js|css)$/); });
          assetsByChunkName[key] = value;
        }
      });
      return JSON.stringify(assetsByChunkName, null, 2)
    }
  })
);