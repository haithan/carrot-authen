const { check } = require("express-validator");

module.exports = [
  check("email", "Your email is not valid")
    .not()
    .isEmpty()
    .isEmail()
    .normalizeEmail(),
  check("password", "Your password must be at least 8 characters")
    .not()
    .isEmpty()
    .isLength({ min: 8 }),
];
