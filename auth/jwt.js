const jwtHelper = require('../utils/jwtHelpers')
const passport = require('passport')
const db = require("../db/connection");

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtHelper.SECRET;
opts.issuer = jwtHelper.ISSUER;
opts.audience = jwtHelper.AUDIENCE;

//  Passport Initialization
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(async function (id, done) {
    try{
        const user = await db('users').where('id', id).first()
        done(null, user)
    } catch(err){
        return done(err, false)
    }
});

const init = () => {
    passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
        try{
            const user = await db('users').where('id', jwt_payload.sub).first()
            done(null, user)
        } catch(err){
            return done(err, false)
        }
    }));
}

module.exports = {
    init
}
