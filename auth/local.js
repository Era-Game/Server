const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const authHelpers = require("../utils/authHelpers");
const db = require("../db/connection");

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db('users').where('id', id).first().then(function (row) {
        done(null, row);
    });
});

passport.use(new LocalStrategy(
    {usernameField: "email", passwordField:"password"},
    function(email, password, done) {
        // look for the user data
        db('users').where('email', email).first()
            .then(function(row){
                if (!authHelpers.verifyPassword(password, row.password)) { return done(null, false, {
                    message: 'Invalid password.' }); }
                return done(null, row);
            })
            .then(function(id){
                console.log('user login success:' + id);
            })
            .catch(function (error) {
                console.error(error)
                return done(null, false, { message: 'Incorrect username or password' });
            })
        return done(null, null)
    }
));

module.exports = passport;
