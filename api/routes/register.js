const express = require("express");
const passport = require("passport");

const { register } = require("../handlers");
const { type, handler, validate } = register;

const name = "register";
const router = express.Router();

router[type]("/", validate, handler);

module.exports = { name, router };
