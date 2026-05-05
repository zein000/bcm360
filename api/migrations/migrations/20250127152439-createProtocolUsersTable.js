"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("course-progress-users", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal("(UUID())"),
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
			firstName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("course-progress-users");
	},
};
