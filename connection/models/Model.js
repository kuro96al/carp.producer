const Database = require('./Database');

class Model {
  constructor() {
    this.database = new Database();
    this.connection = this.database.open();
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  ok() {
    const sql = 'select 1';
    const params = [];
    return this.query(sql, params);
  }

  end() {
    this.connection.end();
    this.database.close();
  }
}

module.exports = Model;
