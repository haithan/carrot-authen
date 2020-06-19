const { Model, DataTypes } = require("sequelize");
const models = require("./index");

class ResetToken extends Model {
  static init(sequelize) {
    return super.init(
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
        modelName: "user_resettokens",
        sequelize,
      }
    );
  }
}

module.exports = ResetToken;
