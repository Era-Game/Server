const db = require("../db/connection");

const findById = function (id) {
    return new Promise(function (resolve, reject) {
        db('organizations')
            .where('id', id)
            .first()
            .then(function(row){
                console.log("find by organization id:" + row.id)
                resolve(row);
            })
            .catch(function (err){
                reject(Error(err))
            })
    })
}

module.exports = {
    findById,
}
