const { Model, DataTypes } = require("sequelize");
const models = require("./index");

const bcrpyt = require("bcrypt");
const saltRounds = 10;

class User extends Model {
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
          validate: {
            isEmail: true,
          },
        },
        googleId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
        encrypted_password: {
          type: DataTypes.STRING,
          min: 8,
        },
        verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        modelName: "user",
        sequelize,
      }
    );
  }

  async validatePassword(password) {
    const stored_pw = this.getDataValue("encrypted_password");
    return await bcrpyt.compare(password, stored_pw);
  }

  async setPassword(val) {
    const encrypted_password = await bcrpyt.hash(val, saltRounds);
    await this.setDataValue("encrypted_password", encrypted_password);
    await this.save();
  }
}

module.exports = User;
