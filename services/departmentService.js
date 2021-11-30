const db = require("../db/connection");

const findById = function (id) {
    return new Promise(function (resolve, reject) {
        db('departments')
            .where('id', id)
            .first()
            .then(function(row){
                console.log("find by department id:" + row.id)
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
