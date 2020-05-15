const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "carrott-node.cmoyikxbbpvu.eu-west-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "1qaz2wsx",
  database: "carrott",
});

connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database");
  }
});
module.exports = connection;
