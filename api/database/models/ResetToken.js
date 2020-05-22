const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");

class ResetToken extends Model {}

ResetToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      min: 1,
    },
    email: {
      type: DataTypes.STRING,
      isEmail: true,
    },
    token: {
      type: DataTypes.STRING,
    },
    expiration: {
      type: DataTypes.DATE,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    used: {
      type: DataTypes.INTEGER,
    },
  },
  {
    modelName: "ResetToken",
    sequelize,
  }
);

module.exports = ResetToken;
