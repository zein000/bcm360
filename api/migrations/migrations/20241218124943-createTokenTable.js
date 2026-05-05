"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("token", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userId: {
				type: Sequelize.INTEGER,
				references: {
					model: "user",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: true,
			},
			purpose: {
				type: Sequelize.ENUM("INVITATION", "FORGOTTEN_PASSWORD", "RESET_PASSWORD", "CHANGE_EMAIL"),
				allowNull: false,
			},
			token: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			isUsed: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			createdAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
			},
		});
		await queryInterface.addIndex("token", ["userId"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("token");
		await queryInterface.removeIndex("token", ["userId"]);
	},
};
