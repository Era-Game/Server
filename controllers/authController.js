const authService = require('../services/authService');
const userService = require('../services/userService');
const deptService = require('../services/departmentService');
const orgService = require('../services/organizationService');
const authHelpers = require("../utils/authHelpers");

const login =  async (req, res) => {
    console.log("[Controller Start] login")
    console.log("request body:" + JSON.stringify(req.body))

    try{
        const user = await userService.findByEmail(req.body.email)
        if (!await authHelpers.verifyPassword(req.body.password, user.password)) {
            return res.status(403).json({status: "email or password error"});
        }

        const dept = await deptService.findById(user.dept_id)
        const org = await orgService.findById(dept.org_id)
        user['organization'] = org.name
        user['department'] = dept.name

        const user_jwt = await authService.generateJWT(user);

        // delete password field
        delete user['password']

        console.log("[Controller End] login")
        return res.status(200).json({status: "login successfully", access_token: user_jwt, user: user});
    } catch (err) {
        console.log(err)
        return res.status(403).json({status: "email or password error"});
    }
}


module.exports = {
    login
};
