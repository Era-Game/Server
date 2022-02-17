require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const PORT = process.env.PORT || 80;

const game = require('./routes/game.js');
const team = require('./routes/team.js');
const user = require('./routes/user.js');
const util = require('./routes/util.js');
const auth = require('./routes/auth.js');

const local_passport = require('./auth/local')
const jwt_passport = require('./auth/jwt')

const app = express()
app.use(bodyParser.json())

app.use('/game', game)
app.use('/team', team)
app.use('/user', user)
app.use('/util', util)
app.use('/auth', auth)

app.use(passport.initialize())
local_passport.init()
jwt_passport.init()

const team_ws = require('./ws/team_match')
const game_ws = require('./ws/game_match')

app.get('/', function (req, res) {
  res.send('Era Game Server');
});

app.listen(PORT, err => {
  if(err) throw err;
  console.log("Server running");
})
