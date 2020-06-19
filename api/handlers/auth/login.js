const passport = require("passport");
const passportLocal = require("passport-local");
const { User } = require("../../database/models")();
const constants = require("../../constants");
const { createToken } = require("../../utils/jwt-token");

passport.use(
  "login",
  new passportLocal.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    (email, password, done) => {
      try {
        User.findOne({ where: { email } }).then((user) => {
          if (user === null) {
            return done(
              {
                message: constants.INVALID_CREDENTIALS,
                auth: false,
                response: { status: 400 },
              },
              false
            );
          } else {
            user.validatePassword(password).then((validated) => {
              if (!validated)
                return done(
                  {
                    message: constants.INVALID_CREDENTIALS,
                    auth: false,
                    response: { status: 400 },
                  },
                  false
                );
              return done(null, user);
            });
          }
        });
      } catch (err) {
        /* istanbul ignore next */
        return done(err);
      }
    }
  )
);

module.exports = async (req, res, next) => {
  const { cms } = req.query || { cms: false };

  passport.authenticate("login", (err, user, info) => {
    if (err) return next(err);
    if (info) return res.json(info);
    req.logIn(user, (err) => {
      if (err) return next(err);
      if (cms && !user.isAdmin)
        return next({ message: constants.INVALID_CREDENTIALS }, null);

      createToken(user).then((token) => {
        res.status(200).json({
          auth: true,
          token: token,
        });
      });
    });
  })(req, res, next);
};
