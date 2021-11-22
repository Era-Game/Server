const jwtHelpers = require('../utils/jwtHelper');

const generateJWT = (user) => {
    console.log(user)
    return jwtHelpers.generate(user)
};

module.exports = {
    generateJWT
}
