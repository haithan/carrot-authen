const connection = require("../../database/connection");
const bcrpyt = require("bcrypt");
const saltRounds = 10;

module.exports = async (req, res, next) => {
  const today = new Date();
  const { first_name, last_name, email, password } = req.body;
  if (!first_name) throw new Error('first_name not provided');
  if (!last_name) throw new Error('last_name not provided');
  if (!email) throw new Error('email not provided');
  if (!password) throw new Error('password not provided');
  const encryptedPassword = await bcrpyt.hash(password, saltRounds);

  const users = {
    first_name,
    last_name,
    email,
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
        throw error;
      } 
      const data = {
        status: true,
        message: 'user registered sucessfully',
        data: {
          first_name,
          last_name,
          email,
          created_at: users.created_at,
          updated_at: users.updated_at,
        },
      };
      res.json(data);
    });
  } catch (e) {
    next(e);
  }
};
