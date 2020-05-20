const User = require('../../database/User');
const passport = require('passport');
const passportLocal = require('passport-local');

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser((id, done) => {
  User.findOne({ where: { id }}, (err, user) => {
    done(err, user);
  });
});

passport.use('register', new passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  try {
    User.findOne({ where: { email } }).then((user) => {
      if (user) return done(null, false, { message: 'Email already exists' });
      else {
        User.create({ email }).then((user) => {
          user.setPassword(password);
          user.save();
          return done(null, user);
        });
      }
    });
  } catch (err) {
    return done(err);
  }
}));

module.exports = async (req, res, next) => {
  passport.authenticate('register', (err, user) => {
    if (err) throw err;
    req.logIn(user, err => {
      if (err) throw err;
      User.findOne({ where: { email: user.email } }).then(() => {
        res.status(200).json({ message: 'user created' });
      });
    });
  })(req, res, next);
};
