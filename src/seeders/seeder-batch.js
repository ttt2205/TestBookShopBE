"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("batches", [
      {
        book_id: 1,
        receipt_id: 1,
        quantity: 10,
        price: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        book_id: 2,
        receipt_id: 1,
        quantity: 20,
        price: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("batches", null, {});
  },
};
