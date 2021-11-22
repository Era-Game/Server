const bcrypt = require('bcrypt');

const saltRounds = 10;

const bcryptPassword = function (plaintextPassword) {
    return new Promise(function(resolve, reject)
    {
        bcrypt.hash(plaintextPassword, saltRounds).then( function (result) {
            if ( result != null)
            {
                resolve(result);
            }
            else
            {
                reject(Error("bcrypt password error!"));
            }
        })
    });
}

const verifyPassword = (userPassword, hashedPassword) => {
    bcrypt.compare(userPassword, hashedPassword).then(function(result){
        return result
    }).catch(function(error){
        console.error(error)
    })
    return false
}

module.exports = {
    bcryptPassword,
    verifyPassword
}
