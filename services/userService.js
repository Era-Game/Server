const db = require("../db/connection");
const authHelpers = require('../utils/authHelpers');
const {error} = require("firebase-functions/lib/logger");

const create = function (req) {
    return new Promise(function (resolve, reject) {
        // get hashed password
        authHelpers.bcryptPassword(req.body.password).then( function(hashedPwd){
            // save user into DB
            const user = db('users')
                .insert({
                    email: req.body.email,
                    password: hashedPwd,
                })
                .returning('*')

            resolve(user);
        }).catch(function (err) {
            reject(Error(err))
        })
    })
}

module.exports = {
    create
}
