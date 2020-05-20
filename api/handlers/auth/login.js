const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../../database/User');
const { createToken } = require('../../utils/jwt-token');

passport.use('login', new passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
}, (email, password, done) => {
  try {
    User.findOne({ where: { email } }).then((user) => {
      if (user === null) {
        return done(null, false, { auth: false, message: 'invalid credentials' });
      } else {
        user.validatePassword(password).then((validated) => {
          if (!validated) return done(null, false, { auth: false, message: 'invalid credentials' });
          return done(null, user); 
        });
      }
    });
  } catch (err) {
    return done(err);
  }
}));

module.exports = async (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) throw err;
    if (info) res.json(info);
    req.logIn(user, (err) => {
      if (err) throw err;
      User.findOne({ where: { email: user.email } }).then((u) => {
        if (u) {
          createToken(u.email).then((token) => {
            res.status(200).json({
              auth: true,
              token: token,
            });  
          });
        }
      });
    });
  })(req, res, next);
};
