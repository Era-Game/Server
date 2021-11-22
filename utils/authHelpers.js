const bcrypt = require('bcrypt');

const saltRounds = 10;

const bcryptPassword = (plaintextPassword) => {
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

const verifyPassword = async (userPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(userPassword, hashedPassword);
    } catch (err){
        console.log(err)
    }
}

module.exports = {
    bcryptPassword,
    verifyPassword
}
