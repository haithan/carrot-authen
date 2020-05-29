const Sequelize = require("sequelize");
const config = require("config");

const uri = config.get("db.uri");
let opt;
if (process.env.NODE_ENV === "test") opt = { logging: false };
else opt = { logging: console.log, timezone: "UTC" };

const sequelize = new Sequelize(uri, opt);

sequelize.sync();

module.exports = sequelize;
