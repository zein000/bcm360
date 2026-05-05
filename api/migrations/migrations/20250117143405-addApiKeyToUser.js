"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "apiKey", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "apiKey");
  },
};