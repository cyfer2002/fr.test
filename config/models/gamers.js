var express    = require('express');
var router     = express.Router();
var pool = require('./database');
var passport = require('passport');

// Passport initialize
router.use(passport.initialize());
router.use(passport.session());

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
      listGamers[j] = {id : row.id, name : row.name, lastname : row.lastname};
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

router.put('/:idPlayers', function(req, res, next) {
  var errors = checkBoxForm(req.body);
  if (Object.keys(errors).length) {
    req.session.params = req.body;
    req.flash("danger", errors)
    return res.send({errors : errors});
  }
  var errors = {};
  var message;
  var selectQuery = 'UPDATE PLAYERS set ? WHERE idPlayers = '+req.params.idPlayers;
  console.log(req.body);
  var cnx = pool.getConnection(function(err, cnx){
    var sqlQuery = cnx.query(selectQuery, req.body);
    sqlQuery.on("result", function(row) {
      message = "Player Updated";
    });
    sqlQuery.on("end", function() {
      cnx.destroy();
      res.send({
        message: message,
        error: errors
      });
    });
    sqlQuery.on("error", function(error) {
      errors = error.message;
      console.log(error);
    });
  });
});

module.exports = router;