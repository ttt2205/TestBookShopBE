const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const languages = sequelize.define(
    "languages",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      language_code: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      language_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "languages",
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

  languages.associate = function (models) {
    languages.hasMany(models.books, { foreignKey: "language_id" });
  };

  return languages;
};
