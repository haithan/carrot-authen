const express = require("express");
const passport = require("passport");

const { login } = require("../handlers");
const apple = require("../middleware/apple.auth");
const facebook = require("../middleware/facebook.auth");
const google = require("../middleware/google.auth");
const { type, handler, validate } = login;

const name = "login";
const router = express.Router();

if (validate) router[type]("/", validate, handler);
else router[type]("/", handler);

router.get("/apple", passport.authenticate("apple"));
router.post("/apple", require("../handlers/login/apple"));
router.post("/apple/callback", apple);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.post("/facebook", require("../handlers/login/facebook"));
router.get("/facebook/callback", facebook);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "https://www.googleapis.com/auth/plus.login"],
  })
);
router.post("/google", require("../handlers/login/google"));
router.get("/google/callback", google);

module.exports = { name, router };
