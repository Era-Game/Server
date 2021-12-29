const jwtHelpers = require('../utils/jwtHelpers');

const generateJWT = (user) => {
    console.log(user)
    return jwtHelpers.generate(user)
};

module.exports = {
    generateJWT
}
