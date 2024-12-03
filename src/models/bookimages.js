const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const bookimages =  sequelize.define('bookimages', {
    bookImage_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'books',
        key: 'book_id'
      }
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_main: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bookimages',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bookImage_id" },
        ]
      },
      {
        name: "book_id",
        using: "BTREE",
        fields: [
          { name: "book_id" },
        ]
      },
    ]
  });

  //associations
  bookimages.associate = models => {
    bookimages.belongsTo(models.books, {foreignKey: 'book_id'});
  };

  return bookimages;
};
