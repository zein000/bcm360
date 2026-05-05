'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course-progress-content', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
			courseProgressId: {
				type: Sequelize.UUID,
				references: {
					model: "course-progress",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: false,
			},
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      contentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timeStamp: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stageNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('course-progress-content');
  },
};
