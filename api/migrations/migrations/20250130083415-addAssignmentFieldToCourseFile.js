"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("course-file", "fileAssignment", {
			type: Sequelize.ENUM("Content", "Thumbnail", "TrailerVideo", "LargeImage"),
			allowNull: false,
			defaultValue: "Content",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("course-file", "fileAssignment");
	},
};
