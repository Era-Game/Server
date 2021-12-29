require('dotenv').config({ path: '.env.dev' })

module.exports = {
  client: 'mysql',
  version: '10.6.4',
  connection: {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user :process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  }
}

