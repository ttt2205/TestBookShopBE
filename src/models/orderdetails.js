const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const orderdetails = sequelize.define(
    "orderdetails",
    {
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "order_id",
        },
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "batches",
          key: "batch_id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      final_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "discounts",
          key: "discount_id",
        },
      },
    },
    {
      sequelize,
      tableName: "orderdetails",
      timestamps: true,
      indexes: [
        {
          name: "discount_id",
          using: "BTREE",
          fields: [{ name: "discount_id" }],
        },
      ],
    }
  );

  return orderdetails;
};
