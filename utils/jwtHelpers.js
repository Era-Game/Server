const jwt = require('jsonwebtoken')

const SECRET = "===era-game-jwt=="
let SECRET_OBJ = ""
const ISSUER = 'accounts.era-game.com'
const AUDIENCE = 'era-game-unity-client'
const { webcrypto, KeyObject } = require('crypto')
const { subtle } = webcrypto;

const generate = async (user) => {
    const key = await subtle.generateKey({
        name: 'HMAC',
        hash: 'SHA-256',
        length: 256
    }, true, ['sign', 'verify']);

    SECRET_OBJ = KeyObject.from(key);
    return jwt.sign({username: user.username}, SECRET,
        {subject: user.id.toString(), issuer: ISSUER, audience: AUDIENCE, expiresIn: '1h'})
}

const verify = function (token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, SECRET, {complete: true}, function(err, decoded) {
            if (err == null) {
                console.log("success")
                resolve(decoded)
            } else {
                reject(Error(err))
            }
        });
    })
}

module.exports = {
    SECRET,
    ISSUER,
    AUDIENCE,
    generate,
    verify
}
