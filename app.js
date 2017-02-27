var express = require('express')
  , logger = require('morgan');
var session = require('client-sessions');
var path = require('path');
var fs = require('fs');
var routes = require('./config/routes');
var config = require('./config/config');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();

app.set('views', path.join(__dirname, 'source/templates'));
app.set('view engine', 'jade');

// Sessions
app.use(session({
  cookieName: 'session',
  secret: 'skadkshdjhaskjdhueopqoeqpeqmncjxuch',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));
app.use('/', routes);

// Redirect jquery, bootstrap, font-awesome
app.use('/images', express.static(__dirname + '/source/images'));
app.use('/fonts', express.static(__dirname + '/source/fonts'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'production') {
  var assetManifestPath = path.join(__dirname, 'public', 'assets', 'webpack-asset-manifest.json');
  if (fs.existsSync(assetManifestPath)) {
    app.locals.assetManifest = JSON.parse(fs.readFileSync(assetManifestPath));
  }
}

app.locals.environment = app.get('env');
app.locals.company = config.company;
app.locals.moment = require('moment');

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;