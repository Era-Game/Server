const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const authHelpers = require("../utils/authHelpers");
const db = require("../db/connection");

const init = () => {
    passport.use(new LocalStrategy(
        {usernameField: "email", passwordField:"password"},
        function(email, password, done) {
            // look for the user data
            db('users').where('email', email).first()
                .then(function(row){
                    if (!authHelpers.verifyPassword(password, row.password)) {
                        return done(null, false, { message: 'Invalid password.' });
                    }
                    console.log('user login success:' + row.id);
                    return done(null, row);
                })
                // .catch(function (error) {
                //     console.error(error)
                //     return done(null, false, { message: 'Incorrect username or password' });
                // })
            return done(null, false)
        }
    ));
}

module.exports = {
    init
}
