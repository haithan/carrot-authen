const login = require("./login");
const register = require("./register");
const passwordReset = require("./passwordReset");
const verify = require("./verify");

require("../utils/notification");

module.exports = { login, register, passwordReset, verify };
