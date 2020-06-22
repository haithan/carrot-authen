const { Model, DataTypes } = require("sequelize");
const crypto = require("crypto");
const models = require("./index");

class EmailToken extends Model {
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
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: () => {
            return crypto.randomBytes(20).toString("hex");
          },
        },
        expiration: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: () => {
            const now = new Date();
            now.setDate(now.getDate() + 3);
            return now;
          },
        },
        used: {
          type: DataTypes.DATE,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        modelName: "user_emailtokens",
        sequelize,
      }
    );
  }
}

module.exports = EmailToken;
