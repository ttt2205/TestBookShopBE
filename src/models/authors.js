const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const authors = sequelize.define(
    "authors",
    {
      author_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "authors",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "author_id" }],
        },
      ],
    }
  );

  //many-to-many
  authors.associate = function (models) {
    authors.belongsToMany(models.books, {
      through: "bookauthors",
      foreignKey: "author_id",
      otherKey: "book_id",
    });
  };

  return authors;
};
