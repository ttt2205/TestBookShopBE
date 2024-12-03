const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const batches = sequelize.define(
    "batches",
    {
      batch_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "books",
          key: "book_id",
        },
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      tableName: "batches",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "batch_id" }],
        },
        {
          name: "book_id",
          using: "BTREE",
          fields: [{ name: "book_id" }],
        },
      ],
    }
  );

  batches.associate = function (models) {
    batches.belongsTo(models.books, {
      as: "book",
      foreignKey: "book_id",
    });
    batches.belongsToMany(models.goodsreceipt, {
      as: "goodsreceipts",
      through: models.goodsreceiptdetails,
      foreignKey: "batch_id",
      otherKey: "receipt_id",
    });
  };

  return batches;
};
