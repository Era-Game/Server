const jwtHelpers = require("../utils/jwtHelpers");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    console.log(token)
    try {
        const decoded = await jwtHelpers.verify(token)
        console.log("decoded:" + JSON.stringify(decoded.payload))
        res.locals.payload = decoded.payload
        next()
    } catch (err) {
        console.log(err)
        return res.status(403).json({status: err.message});
    }

}

module.exports = authenticateToken

