const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const order = sequelize.define(
    "orders",
    {
      order_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "customers",
          key: "customer_id",
        },
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "orderstatus",
          key: "id",
        },
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      billPromotion_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "billpromotions",
          key: "billPromotion_id",
        },
      },
    },
    {
      sequelize,
      tableName: "orders",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "order_id" }],
        },
        {
          name: "customer_id",
          using: "BTREE",
          fields: [{ name: "customer_id" }],
        },
        {
          name: "status_id",
          using: "BTREE",
          fields: [{ name: "status_id" }],
        },
        {
          name: "billPromotion_id",
          using: "BTREE",
          fields: [{ name: "billPromotion_id" }],
        },
      ],
    }
  );

  order.associate = function (models) {
    order.belongsTo(models.customers, {
      foreignKey: "customer_id",
      as: "customer",
    });
    order.belongsTo(models.orderstatus, {
      as: "orderstatus",
      foreignKey: "status_id",
    });
    order.belongsTo(models.billpromotions, {
      foreignKey: "billPromotion_id",
    });
    order.belongsToMany(models.batches, {
      through: models.orderdetails,
      foreignKey: "order_id",
      otherKey: "batch_id",
      as: "batches",
    });
  };

  return order;
};
