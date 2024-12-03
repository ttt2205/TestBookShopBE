const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('booktranslators', {
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'books',
        key: 'book_id'
      }
    },
    translator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'translators',
        key: 'translator_id'
      }
    }
  }, {
    sequelize,
    tableName: 'booktranslators',
    timestamps: true,
    indexes: [
      {
        name: "book_id",
        using: "BTREE",
        fields: [
          { name: "book_id" },
        ]
      },
      {
        name: "translator_id",
        using: "BTREE",
        fields: [
          { name: "translator_id" },
        ]
      },
    ]
  });
};
