const { Model, DataTypes, UUIDV4 } = require("sequelize");
const models = require("./index");

class Profile extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          min: 1,
        },
        uuid: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4(),
        },
        email: {
          type: DataTypes.STRING,
          validate: {
            isEmail: true,
          },
          unique: true,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        full_name: {
          type: DataTypes.VIRTUAL,
          get() {
            return `${this.first_name} ${this.last_name}`;
          },
          set(value) {
            throw new Error("Don't set to a virtual");
          },
        },
        date_of_birth: DataTypes.DATE,
        telephone_number: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
            isNumeric: true,
          },
        },
        is_valid_telephone: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        image_url: {
          type: DataTypes.TEXT,
          validate: {
            isUrl: true,
          },
        },
        account_type: {
          type: DataTypes.TINYINT,
          defaultValue: 0,
        },
        stripe_connect_id: {
          type: DataTypes.STRING,
        },
        stripe_cust_id: {
          type: DataTypes.STRING,
        },
        currency: {
          type: DataTypes.STRING,
          defaultValue: "GBP",
        },
        loc_lat: {
          type: DataTypes.DECIMAL(8, 6),
        },
        loc_lon: {
          type: DataTypes.DECIMAL(9, 6),
        },
        biography: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        modelName: "profiles",
        sequelize,
      }
    );
  }
}

module.exports = Profile;
