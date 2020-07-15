const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const config = require("config");
const { User } = require("../database/models")();
const { createToken } = require("../utils/jwt-token");

/* istanbul ignore next */
passport.use(
  new FacebookStrategy(
    {
      clientID: config.get("auth.facebook.id"),
      clientSecret: config.get("auth.facebook.secret"),
      callbackURL: config.get("auth.facebook.callback"),
      profileFields: ["id", "emails", "name"],
    },
    (accessToken, refreshToken, profile, cb) => {
      try {
        User.findOne({ where: { facebookId: profile.id } }).then((user) => {
          if (!user) {
            User.upsert({
              email: profile.emails[0].value,
              facebookId: profile.id,
              verified: true,
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
  passport.authenticate("facebook", (err, user, info) => {
    if (err) {
      res.json({
        auth: false,
        message: err,
      });
    } else {
      createToken(user).then((token) => {
        res.redirect(`carrott://Social/?provider=facebook&token=${token}`);
      });
    }
  })(req, res, next);
};
