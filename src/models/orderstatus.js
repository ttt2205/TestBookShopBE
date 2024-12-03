const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const orderstatus = sequelize.define(
    "orderstatus",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      status_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Chờ xác nhận, Chờ thanh toán, Đã thanh toán",
      },
    },
    {
      sequelize,
      tableName: "orderstatus",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );

  orderstatus.associate = (models) => {
    orderstatus.hasMany(models.orders, { foreignKey: "status_id" });
  };

  return orderstatus;
};
