const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "bookdiscount",
    {
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "books",
          key: "book_id",
        },
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "discounts",
          key: "discount_id",
        },
      },
    },
    {
      sequelize,
      tableName: "bookdiscount",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "book_id" }, { name: "discount_id" }],
        },
        {
          name: "discount_id",
          using: "BTREE",
          fields: [{ name: "discount_id" }],
        },
        {
          name: "book_id",
          using: "BTREE",
          fields: [{ name: "book_id" }],
        },
      ],
    }
  );
};
