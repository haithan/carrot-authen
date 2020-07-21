const constants = require("../../constants");
const passport = require("passport");
const passportLocal = require("passport-local");
const Sequelize = require("sequelize");
const socket = require("../../utils/notification");
const { EmailToken, User } = require("../../models")();
const { createToken } = require("../../utils/jwt-token");
const { validationResult } = require("express-validator");

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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: constants.VALIDATION_ERROR,
        errors: errors.array(),
      });
    }

    passport.authenticate("register", (err, user) => {
      try {
        if (err) throw err;
        req.logIn(user, (err) => {
          /* istanbul ignore next */
          if (err) throw err;
          User.findOne({ where: { email: user.email } }).then(() => {
            EmailToken.create({ email: user.email }).then(({ token }) => {
              socket.emit("emailMessage", {
                type: "register",
                to: user.email,
                content: token,
              });
              createToken(user).then((token) => {
                res.status(200).json({
                  auth: true,
                  token: token,
                  message: constants.USER_CREATED,
                });
              });
            });
          });
        });
      } catch (err) {
        return next(err);
      }
    })(req, res, next);
  } catch (err) {
    next(err);
  }
};
