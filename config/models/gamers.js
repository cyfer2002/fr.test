var express    = require('express');
var router     = express.Router();
var pool = require('./database');
var passport = require('passport');
var babel = require('babel-core');
var path       = require('path');

// Passport initialize
router.use(passport.initialize());
router.use(passport.session());

/*Import Fonction JS.es6 CheckForm*/
var checkGamersForm = eval(babel.transformFileSync(path.join(__dirname, '../../source/app/gamers/check_form.es6'), {
  presets: ['es2015']
}).code);

/* GET gamers list. */
router.get('/', function(req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  var listGamers = [];
  var j = 0;
  var selectQuery = 'SELECT * FROM gamers';
  
  
  var cnx = pool.connect(function(err, cnx, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var sqlQuery = cnx.query(selectQuery);
    sqlQuery.on("row", function(row) {
      listGamers[j] = {id : row.id, name : row.name, lastname : row.lastname, email : row.email, birthday : row.birthday};
      j++;
    });
    sqlQuery.on("end", function() {
      done();
      res.render('gamers', {
          title: 'Participants',
          params: params,
          success: success,
          errors: errors,
          gamers: listGamers,
          user: user
        });
    });
    sqlQuery.on("error", function(error) {
      console.log(error);
    });
  });
});

router.get('/:name', function(req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  var id = {};
  var selectQuery = 'SELECT id FROM gamers WHERE name = ($1)';


  var cnx = pool.connect(function(err, cnx, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var sqlQuery = cnx.query(selectQuery, [req.params.name]);
    sqlQuery.on("row", function(row) {
      id = row.id;
    });
    sqlQuery.on("end", function() {
      done();
      res.send({
        id : id
      });
    });
    sqlQuery.on("error", function(error) {
      res.send({
        error: error
      })
      console.log(error);
    });
  });
});

router.post('/', function(req, res, next) {
  var errors = checkGamersForm(req.body);
  if (Object.keys(errors).length) {
    req.session.params = req.body;
    req.flash("danger", errors)
    return res.send({errors : errors});
  }
  errors = {};
  var selectQuery = 'INSERT INTO gamers (name, lastname, email, birthday) VALUES (($1), ($2), ($3), ($4));';

  var cnx = pool.connect(function(err, cnx, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var sqlQuery = cnx.query(selectQuery, [req.body.name, req.body.lastname, req.body.email, req.body.birthday]);
    sqlQuery.on("row", function(row) {
    });
    sqlQuery.on("end", function() {
      done();
      res.send({
        message: "Gamer Inserted"
      });
    });
    sqlQuery.on("error", function(error) {
      errors = error.message;
      console.log(error);
      res.send({
        error: errors
      });
    });
  });
});

module.exports = router;