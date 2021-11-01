const db = require('knex')({
    client: 'mysql',
    version: '10.6.4',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'root',
        password : 'eragame',
        database : 'era_game'
    }
});

module.exports = db

