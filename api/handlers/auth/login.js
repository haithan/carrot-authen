const passport = require('passport');
const passportLocal = require('passport-local');
const jwt = require('jsonwebtoken');
const User = require('../../database/User');

const secret = 'tempSecretPasswordThatWillNotRemainLikeThis';

passport.use('login', new passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
}, (email, password, done) => {
  try {
    User.findOne({ where: { email } }).then((user) => {
      if (user === null) {
        return done(null, false, { auth: false, message: 'bad username' });
      } else {
        user.validatePassword(password).then((validated) => {
          if (!validated) return done(null, false, { auth: false, message: 'bad password' });
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
    if (err) console.error(err);
    if (info) res.json(info);
    req.logIn(user, (err) => {
      User.findOne({ where: { email: user.email } }).then((u) => {
        if (u) {
          const token = jwt.sign({ id: u.id, username: u.username }, secret);
          res.status(200).json({
            auth: true,
            token: token,
          });
        }
      });
    });
  })(req, res, next);
};
