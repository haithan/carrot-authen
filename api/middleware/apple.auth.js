const passport = require("passport");
const AppleStrategy = require("passport-apple");
const config = require("config");
const { User } = require("../database/models")();
const constants = require("../constants");
const { createToken } = require("../utils/jwt-token");

/* istanbul ignore next */
passport.use(
  new AppleStrategy(
    {
      clientID: config.get("auth.apple.client_id"),
      teamID: config.get("auth.apple.team_id"),
      callbackURL: config.get("auth.apple.callback_uri"),
      keyID: config.get("auth.apple.key_id"),
      privateKeyLocation: "./config/certs/AuthKey_U56V8L387N.p8",
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, decodedIdToken, profile, cb) => {
      User.findOne({ where: { appleId: profile.email } })
        .then((user) => {
          if (!user) {
            // create user
            User.create({
              email: profile.email,
              appleId: profile.email,
              verified: profile.email_verified,
            }).then((u) => {
              cb(null, u);
            });
          } else {
            cb(null, user);
          }
        })
        .catch((err) => {
          cb(err, null);
        });
    }
  )
);

module.exports = (req, res, next) => {
  passport.authenticate("apple", (err, user, info) => {
    if (err) {
      if (err == "AuthorizationError") {
        res.json({
          auth: false,
          message: "permission denied",
        });
      } else if (err == "TokenError") {
        res.json({
          auth: false,
          message: "invalid token",
        });
      }
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
