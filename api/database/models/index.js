const Sequelize = require("sequelize");
const sequelize = require("./connection");

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
