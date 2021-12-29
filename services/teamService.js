const db = require("../db/connection");
const {getCurrentTime} = require("../utils/common");

const create = function (req) {
    return new Promise(function (resolve, reject) {
        let dt = new Date(Date.now());
        let ts = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate()+ " " +
            dt.getHours() + ":" + dt.getMinutes() + ":" +dt.getSeconds()

        // save game into DB
        db('teams')
            .insert({
                leader_id: req.body.leader_id,
                status: "created",
                created_at: ts,
                updated_at: ts
            })
            .then(function(id){
                console.log("inserted team id:" + id)
                resolve({"id": id, "leader_id": req.body.leader_id, "status": "created"});
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

const findById = function (id) {
    return new Promise(function (resolve, reject) {
        db('teams')
            .where('id', id)
            .first()
            .then(function(row){
                console.log("find by team id:" + row.id)
                resolve(row);
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

const join = function (team_id, user_id, skin_id) {
    let dt = new Date(Date.now());
    let ts = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate()+ " " +
        dt.getHours() + ":" + dt.getMinutes() + ":" +dt.getSeconds()

    return new Promise(function (resolve, reject) {
        db('team_user_list')
            .insert({
                team_id: team_id,
                user_id: user_id,
                skin_id: skin_id,
                status: "joined",
                created_at: ts,
                updated_at: ts
            })
            .then(function(id){
                console.log("inserted team id:" + id)
                resolve();
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

const leave = function (team_id, user_id) {
    return new Promise(function (resolve, reject) {
        db('team_user_list')
            .where({
                team_id: team_id,
                user_id: user_id
            })
            .update({
                status: "left",
                updated_at: getCurrentTime()
            })
            .then(function(id){
                console.log("updated team_user")
                resolve();
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

module.exports = {
    create,
    findById,
    join,
    leave
}
