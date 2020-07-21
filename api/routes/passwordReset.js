const express = require("express");

const { passwordReset } = require("../handlers");
const { type, handler, validate } = passwordReset;

const name = "password-reset";
const router = express.Router();

if (validate) router[type]("/", validate, handler);
else router[type]("/", handler);

module.exports = { name, router };
