const Model = require('./Model');

class Sentimental extends Model {
  constructor(params) {
    super();
    this.tableName = 'sentimentals';
    this.params = params;
  }

  add(sentimental) {
    const sql = `INSERT INTO \`${this.tableName}\`(sentimental, mixed, neutral, negative, positive, \`created_at\`) VALUES(?, ?, ?, ?, ?, now())`;
    const params = this.params;

    return new Promise((resolve, reject) => {
      this.query(sql, params).then((result) => {
        resolve(result);
      }).catch((e) => {
        const err = Error(e.message);
        err.name = 'DatabaseError';
        reject(err);
      });
    });
  }
}

module.exports = Sentimental;
