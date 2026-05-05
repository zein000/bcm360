"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("course-file", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullFilePath: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fileLength: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fileType: {
        type: Sequelize.ENUM("UNKNOWN", "TEXT", "IMAGE", "VIDEO", "AUDIO"),
        allowNull: false,
        defaultValue: "Unknown",
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: "course",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("course-file");
  },
};
