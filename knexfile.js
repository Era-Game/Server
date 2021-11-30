module.exports = {
  client: 'mysql',
  version: '10.6.4',
  connection: {
    host : process.env.DB_HOST,
    port : 3306,
    user : 'admin',
    password : process.env.DB_PASSWORD,
    database : 'era_game'
  }
}

