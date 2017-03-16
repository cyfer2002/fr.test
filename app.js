var express = require('express')
  , logger = require('morgan');
var session = require('client-sessions');
var path = require('path');
var fs = require('fs');
var static = require('serve-static');
var routes = require('./config/routes');
var gamers = require('./config/models/gamers');
var pool = require('./config/models/database');
var config = require('./config/config');
var bodyParser = require('body-parser');
var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var app = express();

app.set('views', path.join(__dirname, 'source/templates'));
app.set('view engine', 'jade');


/* To Generate a Hash Code for Test

// Generate a salt
var salt = bcrypt.genSaltSync(10);
// Hash the password with the salt
var hash = bcrypt.hashSync("nico", salt);
console.log(hash);

*/

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    // Auth Check Logic
    var selectQuery = 'SELECT * FROM public."USERS" WHERE username = ($1)';
    var user;
    var result = false;
    var cnx = pool.connect(function(err, cnx, done2){
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      var sqlQuery = cnx.query(selectQuery, [username]);
      sqlQuery.on("row", function(row) {
        user = row;
        result = true;
      });
      sqlQuery.on("end", function() {
        done2();
        if (result) {
          if (bcrypt.compareSync(password, user.password)) {
//        if(password != user.password){
            return done(null, user);
          }
          else return done(null, false);
        }
        else return done(null, false);
        });

      sqlQuery.on("error", function(error) {
        return done(error);
      });
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
app.use('/gamers/', gamers);

// Redirect jquery, bootstrap, font-awesome
app.use('/images', express.static(__dirname + '/source/images'));
app.use('/fonts', express.static(__dirname + '/source/fonts'));
app.use('/photos', express.static(__dirname + '/source/images/photos'));


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
    var success = req.session.success;
    var errors = req.session.errors || {};
    var params = req.session.params || {};
    var user = req.user;
    res.status(err.status || 500);
    res.render('error', {
      title: err.message,
      message: err.message,
      params: params,
      success: success,
      errors: errors,
      user: user,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  res.status(err.status || 500);
  res.render('error', {
    title: err.message,
    message: err.message,
    params: params,
    success: success,
    errors: errors,
    user: user,
    error: {}
  });
});


module.exports = app;