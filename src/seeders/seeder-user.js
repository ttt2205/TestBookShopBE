"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert("Users", [
            {
                email: "admin@gmail.com",
                password: "123456",
                firstName: "John",
                lastName: "Doe",
                address: "123 Main Street",
                roleId: "R1",
                gender: true,
                phoneNumber: "0123456789",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("Users", null, {});
    },
};
