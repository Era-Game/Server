const userService = require('../services/userService');
const passport = require('../auth/local');

const handleResponse = (res, code, statusMsg) => {
    res.status(code).json({ status: statusMsg });
};

const createUser = (req, res, next) => {
    // passes correct user and pass
    console.log(req.body);
    return userService
        .create(req, res, next)
        .then(() => {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    handleResponse(res, 500, 'error');
                    console.log(info);
                }
                if (user) {
                    handleResponse(res, 200, 'success');
                    console.log(info);
                }
            })(req, res, next);
        })
        .catch(next);
};

module.exports = {
    createUser,
};
