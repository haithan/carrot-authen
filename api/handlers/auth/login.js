const connection = require("../../database/connection");
const { createToken } = require("../../utils/jwt-token");
const bcrypt = require("bcrypt");

module.exports = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async function (error, results, fields) {
      if (error) {
        res.json({
          status: false,
          message: "there are some error with query",
        });
      } else {
        if (results.length > 0) {
          if (bcrypt.compareSync(password, results[0].password)) {
            const token = await createToken(results[0]);
            res.json({
              status: true,
              token: token,
            });
          } else {
            res.json({
              status: false,
              message: "Email and password does not match",
            });
          }
        } else {
          res.json({
            status: false,
            message: "Email does not exits",
          });
        }
      }
    }
  );
};
