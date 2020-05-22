const Sequelize = require("sequelize");
const config = require("config");

const uri = config.get("db.uri");
const sequelize = new Sequelize(uri);

module.exports = sequelize;
