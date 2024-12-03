const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const publishers = sequelize.define(
    "publishers",
    {
      publisher_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: "publishers",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "publisher_id" }],
        },
      ],
    }
  );

  publishers.associate = function (models) {
    publishers.hasMany(models.books, {
      as: "books",
      foreignKey: "publisher_id",
    });
  };

  return publishers;
};
