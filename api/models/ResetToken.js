const { Model, DataTypes } = require("sequelize");
const crypto = require("crypto");
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
          validation: {
            isEmail: true,
          },
        },
        token: {
          type: DataTypes.STRING,
          defaultValue: () => {
            return crypto.randomBytes(20).toString("hex");
          },
        },
        expiration: {
          type: DataTypes.DATE,
          defaultValue: () => {
            const now = new Date();
            now.setDate(now.getDate() + 1);
            return now;
          },
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        used: {
          type: DataTypes.DATE,
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
