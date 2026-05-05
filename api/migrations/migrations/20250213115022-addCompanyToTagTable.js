"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("course-tag", "companyId", {
      type: Sequelize.INTEGER,
				references: {
					model: "company",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: true,
    },);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("course-tag", "companyId");
	},
};