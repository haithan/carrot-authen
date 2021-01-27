const { check } = require("express-validator");

module.exports = [
  check("current_password", "Current password cannot be empty").notEmpty(),
  check("new_password", "New password cannot be empty").notEmpty(),
  check("new_password", "Invalid new password").matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
    "i"
  ),
];
