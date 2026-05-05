"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("course-progress", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal("(UUID())"),
				primaryKey: true,
			},
			status: {
				type: Sequelize.ENUM("NotStarted",
					"InProgress",
          "Paused",
					"Success",
					"Failed"),
				allowNull: false,
				defaultValue: "NotStarted",
			},
			courseId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "course",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "user",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			createdAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_course-progress_status";`);
		await queryInterface.dropTable("course-progress");
	},
};
