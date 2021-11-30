const jwtHelpers = require("../utils/jwtHelpers");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    console.log(token)
    const decoded = await jwtHelpers.verify(token)
    console.log("decoded:" + decoded.payload)
    res.locals.payload = decoded.payload
    next()
}

module.exports = authenticateToken

