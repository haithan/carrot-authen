const User = require("../../database/models/User");
const constants = require("../../constants");
const passport = require("passport");
const passportLocal = require("passport-local");
const Sequelize = require("sequelize");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  /* istanbul ignore next */
  User.findOne({ where: { id } }, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "register",
  new passportLocal.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      User.findOne({ where: { email } }).then((user) => {
        if (user)
          return done({
            message: constants.EMAIL_ALREADY_EXISTS,
            response: { status: 400 },
          });
        else {
          User.create({ email })
            .then((user) => {
              user.setPassword(password).then(() => {
                return done(null, user);
              });
            })
            .catch((err) => {
              done(err);
            });
        }
      });
    }
  )
);

module.exports = async (req, res, next) => {
  passport.authenticate("register", (err, user) => {
    try {
      if (err) throw err;
      req.logIn(user, (err) => {
        /* istanbul ignore next */
        if (err) throw err;
        User.findOne({ where: { email: user.email } }).then(() => {
          res.status(200).json({ message: constants.USER_CREATED });
        });
      });
    } catch (err) {
      if (err instanceof Sequelize.ValidationError)
        return next({
          message: constants.VALIDATION_ERROR,
          response: { status: 400 },
        });
      return next(err);
    }
  })(req, res, next);
};
