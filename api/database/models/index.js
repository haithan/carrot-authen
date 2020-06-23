module.exports = () => {
  const Sequelize = require("sequelize");
  const config = require("config");
  const uri = config.get("db.uri");

  let opt;
  /* istanbul ignore else */
  if (process.env.NODE_ENV === "test") opt = { logging: false };
  else opt = { logging: console.log, timezone: "UTC" };
  const sequelize = new Sequelize(uri, opt);

  const User = require("./User");
  const ResetToken = require("./ResetToken");
  const EmailToken = require("./EmailToken");

  const models = {
    User: User.init(sequelize),
    ResetToken: ResetToken.init(sequelize),
    EmailToken: EmailToken.init(sequelize),
  };

  sequelize.sync();

  Object.values(models).forEach((model) => {
    if (model.associate) model.associate(models);
  });

  return {
    ...models,
    sequelize,
    Sequelize,
  };
};
