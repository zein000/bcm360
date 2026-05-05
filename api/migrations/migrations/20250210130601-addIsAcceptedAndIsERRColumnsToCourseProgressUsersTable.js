"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("course-progress-users", "isAccepted", {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		});
		await queryInterface.addColumn("course-progress-users", "isERR", {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("course-progress-users", "isAccepted");
		await queryInterface.removeColumn("course-progress-users", "isERR");
	},
};
