const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('./connection');
const bcrpyt = require("bcrypt");
const saltRounds = 10;

class User extends Model {
  async validatePassword(password) {
    const stored_pw = this.getDataValue('encrypted_password');
    return await bcrpyt.compare(password, stored_pw);
  }

  async setPassword(val) {
    const encrypted_password = await bcrpyt.hash(val, saltRounds);
    await this.setDataValue('encrypted_password', encrypted_password);
    await this.save();
  }
}

User.init({
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
  encrypted_password: {
    type: DataTypes.STRING,
    min: 8
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  modelName: 'user2',
  sequelize
});

module.exports = User;