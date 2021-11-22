const express = require("express");
const ctrl = require("../controllers/authController");

let route_auth = express.Router();

route_auth.post('/login', ctrl.login)


module.exports = route_auth

