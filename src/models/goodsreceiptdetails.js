const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const goodsreceiptdetails = sequelize.define(
    "goodsreceiptdetails",
    {
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "batches",
          key: "batch_id",
        },
      },
      receipt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "goodsreceipt",
          key: "receipt_id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "goodsreceiptdetails",
      timestamps: true,
      indexes: [],
    }
  );

  goodsreceiptdetails.associate = (models) => {
    goodsreceiptdetails.belongsTo(models.goodsreceipt, {
      as: "goodsreceipt",  // Alias for goodsreceipt
      foreignKey: "receipt_id",  // Foreign key for the relationship
    });

    goodsreceiptdetails.belongsTo(models.batches, {
      as: "batch",  // Alias for batch
      foreignKey: "batch_id",  // Foreign key for the relationship
    });
  };

  return goodsreceiptdetails;
};
