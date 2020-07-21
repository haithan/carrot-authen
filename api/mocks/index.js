const Sequelize = require("sequelize");
const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

const User = require("./User");
const EmailToken = require("./EmailToken");
const ResetToken = require("./ResetToken");

const models = {
  User: User(dbMock),
  EmailToken: EmailToken(dbMock),
  ResetToken: ResetToken(dbMock),
};

dbMock.close = () => Promise.resolve();
dbMock.DataTypes = Sequelize.DataTypes;

module.exports = () => {
  return {
    Sequelize,
    sequelize: dbMock,
    ...models,
  };
};
