const db = require("../db/connection");
const gameModeService = require('../services/gameModeService');

const create = function (req) {
    return new Promise(function (resolve, reject) {
        const game_mode = gameModeService.findByName(req.body.game_mode_name)
        let dt = new Date(Date.now());
        let ts = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate()+ " " +
            dt.getHours() + ":" + dt.getMinutes() + ":" +dt.getSeconds()

        // save game into DB
        db('games')
            .insert({
                game_mode_id: game_mode.id,
                status: req.body.status,
                created_at: ts,
                updated_at: ts
            })
            .then(function(id){
                console.log("inserted game id:" + id)
                resolve({"id": id});
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

const findById = function (id) {
    return new Promise(function (resolve, reject) {
        db('games')
            .where('id', id)
            .first()
            .then(function(row){
                console.log("find by game id:" + row.id)
                resolve(row);
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

module.exports = {
    create,
    findById,
}
