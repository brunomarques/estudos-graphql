require('dotenv').config()

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.APP_DB_HOST,
    port: process.env.APP_DB_PORT,
    user: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASSWORD,
    database: process.env.APP_DB_NAME,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'migrations'
  }
};
