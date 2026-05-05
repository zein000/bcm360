"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("course-progress", "scenarioEndMessage", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("course-progress", "finalPhaseId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("course-progress", "scenarioEndMessage");
		await queryInterface.removeColumn("course-progress", "finalPhaseId");
	},
};
