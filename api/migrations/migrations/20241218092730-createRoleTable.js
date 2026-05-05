"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("role", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			code: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			description: {
				type: Sequelize.STRING,
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

		await queryInterface.addColumn("user", "roleId", {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: "role",
				key: "id",
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("user", "roleId");
		await queryInterface.dropTable("role");
	},
};
