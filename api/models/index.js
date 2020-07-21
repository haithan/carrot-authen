const Sequelize = require("sequelize");
const config = require("config");
const uri = config.get("db.uri");

const opt =
  process.env.NODE_ENV === "test"
    ? { logging: false }
    : { logging: console.log, timezone: "UTC" };
const sequelize = new Sequelize(uri, opt);

const User = require("./User");
const ResetToken = require("./ResetToken");
const EmailToken = require("./EmailToken");

const models = {
  User: User.init(sequelize),
  ResetToken: ResetToken.init(sequelize),
  EmailToken: EmailToken.init(sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

module.exports = () => {
  return {
    ...models,
    sequelize,
    Sequelize,
  };
};
