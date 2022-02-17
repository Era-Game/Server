const db = require("../db/connection");

const findById = function (id) {
    return new Promise(function (resolve, reject) {
        db('game_mode')
            .where('id', id)
            .first()
            .then(function(row){
                console.log("find by game_mode id:" + row.id)
                resolve(row);
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

const findByName = function (name) {
    return new Promise(function (resolve, reject) {
        db('game_mode')
            .where('name', name)
            .first()
            .then(function(row){
                if (row !== undefined){
                    console.log("find by game_mode name:" + row.name)
                    resolve(row);
                
                } else {
                    reject(Error("The game isn't existed."))
                }
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

module.exports = {
    findById,
    findByName
}
