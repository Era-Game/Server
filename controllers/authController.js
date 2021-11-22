const authService = require('../services/authService');
const userService = require('../services/userService');
const authHelpers = require("../utils/authHelpers");

const login =  async (req, res) => {
    console.log("[Controller Start] login")
    console.log("request body:" + JSON.stringify(req.body))

    const user = await userService.findByEmail(req.body.email)

    if (!await authHelpers.verifyPassword(req.body.password, user.password)) {
        return res.status(403).json({status: "email or password error"});
    }

    const user_jwt = authService.generateJWT(user);

    console.log("[Controller End] login")
    return res.status(200).json({status: "login successfully", access_token: user_jwt});
}


module.exports = {
    login
};
