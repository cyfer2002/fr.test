var express    = require('express');
var router     = express.Router();
var pool = require('./database');

/* GET gamers list. */
router.get('/', function(req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
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
          gamers: listGamers
        });
    });
    sqlQuery.on("error", function(error) {
      console.log(error);
    });
  });
});

module.exports = router;