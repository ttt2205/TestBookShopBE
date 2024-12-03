const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const genres = sequelize.define(
    "genres",
    {
      genre_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: "name",
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "genres",
          key: "genre_id",
        },
      },
    },
    {
      sequelize,
      tableName: "genres",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "genre_id" }],
        },
        {
          name: "name",
          unique: true,
          using: "BTREE",
          fields: [{ name: "name" }],
        },
        {
          name: "parent_id",
          using: "BTREE",
          fields: [{ name: "parent_id" }],
        },
      ],
    }
  );

  genres.associate = function (models) {
    genres.hasMany(models.books, { foreignKey: "genre_id" });
  };

  return genres;
};
