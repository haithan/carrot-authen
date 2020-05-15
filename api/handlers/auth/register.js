const connection = require("../../database/connection");

module.exports = async (req, res, next) => {
  const today = new Date();
  const users = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created_at: today,
    updated_at: today,
  };
  try {
    console.log("----->", users);

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
  console.log("------>", users);
};
