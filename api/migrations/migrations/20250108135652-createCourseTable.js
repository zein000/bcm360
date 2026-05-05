"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("course", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			json: {
				type: Sequelize.JSON,
				allowNull: true,
			},
			companyId: {
				type: Sequelize.INTEGER,
				references: {
					model: "company",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: true,
			},
      deletedById: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "user",
					key: "id",
				},
			},
			createdAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
			},
			deletedAt: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("course");
	},
};
