const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('book_shop', 'root', 'trung2205', {
  host: 'localhost',
  dialect: 'mysql'
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    let publisher = require("../models/publishers")(sequelize, Sequelize);
    await publisher.sync({ alter: true });
    publisher.create({
      name: "Kim Dong",
      address: "Hanoi",
      status: 1,
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectDB();

module.exports = connectDB;
