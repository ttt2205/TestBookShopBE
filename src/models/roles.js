const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const roles = sequelize.define(
    "roles",
    {
      role_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Admin, Staff, Customer",
      },
    },
    {
      sequelize,
      tableName: "roles",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "role_id" }],
        },
      ],
    }
  );

  roles.associate = (models) => {
    roles.hasMany(models.accounts, { foreignKey: "role_id" });
  };

  return roles;
};
