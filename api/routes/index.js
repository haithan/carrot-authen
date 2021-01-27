const login = require("./login");
const register = require("./register");
const passwordReset = require("./passwordReset");
const passwordChange = require("./passwordChange");
const verify = require("./verify");

require("../utils/notification");

module.exports = { login, register, passwordReset, passwordChange, verify };
