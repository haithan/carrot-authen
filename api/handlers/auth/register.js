const User = require("../../database/models/User");
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
            message: "Email already exists",
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
          res.status(200).json({ message: "user created" });
        });
      });
    } catch (err) {
      if (err instanceof Sequelize.ValidationError)
        return next({ message: "validation error", response: { status: 400 } });
      return next(err);
    }
  })(req, res, next);
};
