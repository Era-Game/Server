const jwt = require('jsonwebtoken')

const SECRET = 'era-game-jwt'
const ISSUER = 'accounts.era-game.com'
const AUDIENCE = 'era-game-unity-client'

const generate = (payload) => {
    return jwt.sign({username: payload.username}, SECRET,
        { subject: payload.id.toString(), issuer: ISSUER, audience: AUDIENCE, expiresIn: '1h'})
}

module.exports = {
    SECRET,
    ISSUER,
    AUDIENCE,
    generate
}
