const passport = require('passport');
const passportJwt = require('passport-jwt');
const config = require('config');
const User = require('../database/User');


passport.use('jwt', new passportJwt.Strategy(
  {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: config.get('jwt.publicKey'),
  },
  (payload, done) => {
    try {
      User.findOne({ where: { email: payload.sub }}).then((user) => {
        if (user === null) return done(null, false, { message: 'bad user' });
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
));
