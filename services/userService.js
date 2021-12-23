const db = require("../db/connection");
const authHelpers = require('../utils/authHelpers');

const create = function (req) {
    return new Promise(function (resolve, reject) {
        // hash the password
        authHelpers.bcryptPassword(req.body.password).then( function(hashedPwd){
            let dt = new Date(Date.now());
            console.log(Date.now())
            let ts = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate()+ " " +
                dt.getHours() + ":" + dt.getMinutes() + ":" +dt.getSeconds()
            console.log(ts)

            // save user into DB
            db('users')
                .insert({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPwd,
                    created_at: ts,
                    updated_at: ts
                })
                .then(function(id){
                    console.log("inserted user id:" + id)
                    resolve({"id": id, "username": req.body.username, "email": req.body.email});
                })
                .catch(function (err){
                    reject(Error(err))
                })
        }).catch(function (err) {
            reject(Error(err))
        })
    })
}

const findById = function (id) {
    return new Promise(function (resolve, reject) {
        db('users')
            .where('id', id)
            .first()
            .then(function(row){
                console.log("find by user id:" + row.id)
                resolve(row);
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

const findByEmail = function (email) {
    return new Promise(function (resolve, reject) {
        db('users')
            .where('email', email)
            .first()
            .then(function(row){
                if (row !== undefined){
                    console.log("find by user email:" + row.email)
                    resolve(row);
                } else {
                    reject(Error("The user isn't existed."))
                }
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

module.exports = {
    create,
    findById,
    findByEmail
}
