const { query } = require("express-validator");
const { EmailToken } = require("../../models")();

module.exports = [
  query("token", "Token cannot be empty").not().isEmpty(),
  query("token").custom(EmailToken.isValidToken),
];
