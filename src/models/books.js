const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const books = sequelize.define(
    "books",
    {
      book_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      num_page: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      weight: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      publication_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sale_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0.0,
      },
      decription: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "bookstatus",
          key: "id",
        },
      },
      language_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "languages",
          key: "id",
        },
      },
      publisher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "publishers",
          key: "publisher_id",
        },
      },
      genre_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "genres",
          key: "genre_id",
        },
      },
      cover_format_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "coverformats",
          key: "cover_id",
        },
      },
    },
    {
      sequelize,
      tableName: "books",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "book_id" }],
        },
        {
          name: "status_id",
          using: "BTREE",
          fields: [{ name: "status_id" }],
        },
        {
          name: "language_id",
          using: "BTREE",
          fields: [{ name: "language_id" }],
        },
        {
          name: "publisher_id",
          using: "BTREE",
          fields: [{ name: "publisher_id" }],
        },
        {
          name: "genre_id",
          using: "BTREE",
          fields: [{ name: "genre_id" }],
        },
        {
          name: "cover_format_id",
          using: "BTREE",
          fields: [{ name: "cover_format_id" }],
        },
      ],
    }
  );
  //association
  books.associate = (models) => {
    books.hasOne(models.bookimages, { as: "image", foreignKey: "book_id" });
    books.hasMany(models.bookimages, {
      as: "alt_images",
      foreignKey: "book_id",
    });
    books.hasMany(models.batches, { foreignKey: "book_id", as: "stock" });
    books.belongsToMany(models.authors, {
      through: "bookauthors",
      foreignKey: "book_id",
      otherKey: "author_id",
    });
    books.belongsToMany(models.discounts, {
      through: "bookdiscount",
      foreignKey: "book_id",
      otherKey: "discount_id",
      as: "discounts",
    });
    books.belongsTo(models.bookstatus, {
      as: "status",
      foreignKey: "status_id",
    });
    books.belongsTo(models.languages, {
      as: "language",
      foreignKey: "language_id",
    });
    books.belongsTo(models.publishers, {
      as: "publisher",
      foreignKey: "publisher_id",
    });
    books.belongsTo(models.genres, { as: "genre", foreignKey: "genre_id" });
    books.belongsTo(models.coverformats, {
      as: "coverFormat",
      foreignKey: "cover_format_id",
    });
  };
  return books;
};
