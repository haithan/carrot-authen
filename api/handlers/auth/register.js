const connection = require("../../database/connection");
const bcrpyt = require("bcryptjs");
const saltRounds = 10;

module.exports = async (req, res, next) => {
  const today = new Date();
  const encryptedPassword = await bcrpyt.hash(req.body.password, saltRounds);
  const users = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: encryptedPassword,
    created_at: today,
    updated_at: today,
  };
  try {
    connection.query("INSERT INTO users SET ?", users, function (
      error,
      results,
      fields
    ) {
      if (error) {
        res.json({
          status: false,
          message: "there are some errors with the query",
        });
      } else {
        res.json({
          status: true,
          data: results,
          message: "user registered sucessfully",
        });
      }
    });
  } catch (e) {
    next(e);
  }
};
