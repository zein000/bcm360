'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("course-progress", "deletedById", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "user",
        key: "id",
      },
    });
    await queryInterface.addColumn("course-progress", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("course-progress", "deletedById");
		await queryInterface.removeColumn("course-progress", "deletedAt");
	},
};
