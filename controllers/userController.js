const userService = require('../services/userService');
const authService = require('../services/authService');
const user_model = require("../models/user");

const create = async (req, res, next) => {
    // passes correct user and pass
    console.log("[Controller Start] create user")
    console.log("request body:" + JSON.stringify(req.body));

    // validate req body
    const {error} = user_model.validate(req.body)

    // validate success
    if (! error){
        try {
            // create user
            const user = await userService.create(req, res, next)
            const user_jwt = authService.generateJWT(user);
            return res.status(200).json({ status: "create user successfully", access_token: user_jwt});
        } catch(err) {
            console.error(err)
            // check the error type
            if (err.toString().search("ER_DUP_ENTRY") !== -1){ // mysql error: duplicate field
                if (err.toString().search("users_username_unique") !== -1) return res.status(500).json({ status: "This username has already been taken." });
                if (err.toString().search("users_email_unique") !== -1) return res.status(500).json({ status: "This email has already been taken." });
            } else {
                res.status(500).json({ status: "An error occurred while creating user." });
            }
        } finally {
            console.log("[Controller End] create user")
        }
    } else {
        res.status(500).json({ status: error.message });
    }
};

const findById = async (req, res) => {
    console.log("[Controller Start] findById")
    console.log("request payload:" + res.locals.payload);
    if (res.locals.payload.username !== undefined){
        try{
            const user = await userService.findById(res.locals.payload.sub)
            delete user['password']
            return res.status(200).json(user);
        } catch(err) {
            return res.status(404).json({"status": "user not found"})
        }
    } else {
        return res.status(500).json({"status": "please provide user id"})
    }

};

module.exports = {
    create,
    findById,
};
