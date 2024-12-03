const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const coverformats = sequelize.define(
    "coverformats",
    {
      cover_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "coverformats",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "cover_id" }],
        },
      ],
    }
  );

  coverformats.associate = function (models) {
    coverformats.hasMany(models.books, { foreignKey: "cover_format_id" });
  };

  return coverformats;
};
