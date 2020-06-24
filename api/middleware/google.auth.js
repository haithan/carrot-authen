const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require("config");
const { User } = require("../database/models")();
const constants = require("../constants");
const { createToken } = require("../utils/jwt-token");

/* istanbul ignore next */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.get("auth.google.id"),
      clientSecret: config.get("auth.google.secret"),
      callbackURL: "http://localhost:3000/api/v1/login/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      try {
        User.findOne({ where: { googleId: profile.id } }).then((user) => {
          if (!user) {
            User.create({
              email: profile.emails[0].value,
              googleId: profile.id,
              verified: profile.emails[0].verified,
            }).then((u) => {
              cb(null, u);
            });
          } else {
            cb(null, user);
          }
        });
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

module.exports = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      res.json({
        auth: false,
        message: err,
      });
    } else {
      createToken(user).then((token) => {
        res.status(200).json({
          auth: true,
          token,
        });
      });
    }
  })(req, res, next);
};
