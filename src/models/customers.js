const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const customers = sequelize.define(
    "customers",
    {
      customer_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "accounts",
          key: "account_id",
        },
      },
    },
    {
      sequelize,
      tableName: "customers",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "customer_id" }],
        },
        {
          name: "account_id",
          using: "BTREE",
          fields: [{ name: "account_id" }],
        },
      ],
    }
  );

  customers.associate = (models) => {
    customers.belongsTo(models.accounts, { foreignKey: "account_id" });
    customers.hasMany(models.orders, { as: "orders", foreignKey: "customer_id" });
  };

  return customers;
};
