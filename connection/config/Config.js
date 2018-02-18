// 設定を.envからロード
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config =
  {
    development: {
      DATABASE: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'carp_development'
      }
    },
    test: {
      DATABASE: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'carp_test'
      }
    },
    staging: {
      DATABASE: {
        connectionLimit: 10,
        host: process.env.CARP_DATABASE_HOST,
        user: process.env.CARP_DATABASE_USER,
        password: process.env.CARP_DATABASE_PASSWORD,
        database: process.env.CARP_DATABASE_NAME
      }
    },
    production: {
      DATABASE: {
        connectionLimit: 10,
        host: process.env.CARP_DATABASE_HOST,
        user: process.env.CARP_DATABASE_USER,
        password: process.env.CARP_DATABASE_PASSWORD,
        database: process.env.CARP_DATABASE_NAME
      }
    }
  };

class Config {
  constructor() {
    this.database = config[env].DATABASE;
  }
}

module.exports = Config;
