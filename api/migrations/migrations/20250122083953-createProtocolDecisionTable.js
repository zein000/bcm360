"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("protocol-decisions", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			protocolHistoryId: {
				type: Sequelize.INTEGER,
				references: {
					model: "protocol-histories",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: false,
			},
			decision: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			finalDecision: {
				type: Sequelize.STRING,
				allowNull: true,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("protocol-decisions");
	},
};
