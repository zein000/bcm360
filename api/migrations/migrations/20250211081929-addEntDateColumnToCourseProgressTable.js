"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("course-progress", "finishDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("course-progress", "finishDate");
	},
};
