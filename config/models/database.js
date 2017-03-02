var pg = require('pg');

// DataBase config
var config = {
  user: 'badminton', //env var: PGUSER
  database: 'badminton', //env var: PGDATABASE
  password: 'Mm2ppBCsf', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

module.exports = pool;