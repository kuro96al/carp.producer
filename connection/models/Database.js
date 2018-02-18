const mysql = require('mysql');
const Config = require('../config/Config');

const dbConf = new Config()['database'];

class Database {
  open() {
    if (this.pool) {
      return this.pool;
    }

    this.pool = mysql.createPool(dbConf);
    return this.pool;
  }

  close() {
    this.pool.end();
    this.pool = null;
  }
}

module.exports = Database;
