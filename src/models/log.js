const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Log = sequelize.define(
    "Log",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "accounts",
          key: "account_id",
        },
      },
      action: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "log",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "account_id",
          using: "BTREE",
          fields: [{ name: "account_id" }],
        },
      ],
    }
  );

  Log.associate = function (models) {
    Log.hasMany(models.accounts, { foreignKey: "account_id", as: "accounts" });
  };

  return Log;
};
