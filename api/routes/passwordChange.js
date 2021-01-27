const express = require("express");
const passport = require("passport");

const { passwordChange } = require("../handlers");
const { type, handler, validate } = passwordChange;

const name = "password-change";
const router = express.Router();

const auth = passport.authenticate("jwt", { session: false });

if (validate) router[type]("/", auth, validate, handler);
else router[type]("/", auth, handler);

module.exports = { name, router };
