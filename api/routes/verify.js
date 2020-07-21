const express = require("express");
const passport = require("passport");

const { verify } = require("../handlers");
const { type, handler, validate } = verify;

const name = "verify";
const router = express.Router();

router[type]("/", validate, handler);

module.exports = { name, router };
