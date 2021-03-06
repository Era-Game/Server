const express = require('express')
const PORT = process.env.PORT || 3000;


const game = require('./routes/game.js');
const team = require('./routes/team.js');
const user = require('./routes/user.js');
const util = require('./routes/util.js');

const app = express()
app.use('/game', game)
app.use('/team', team)
app.use('/user', user)
app.use('/util', util)

app.get('/', function (req, res) {
  res.send('Era Game Server');
});

app.listen(PORT, err => {
  if(err) throw err;
  console.log("Server running");
})
