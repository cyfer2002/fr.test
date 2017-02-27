var webpack = require('webpack');
var _ = require('lodash');
var config = module.exports = require('./main.config.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');

config = _.merge(config, {
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true
});

config.eslint = _.merge(config.eslint, {
  failOnWarning: true,
  failOnError: true
});

config.plugins.push(
  new WebpackNotifierPlugin({ alwaysNotify: true }),
  //new webpack.optimize.CommonsChunkPlugin('common', 'common-bundle.js'),
  new ExtractTextPlugin("[name].css")
);


