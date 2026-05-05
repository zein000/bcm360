"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("protocol-decision-user", {
			protocolDecisionId: {
				type: Sequelize.INTEGER,
				references: {
					model: "protocol-decisions",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: false,
			},
      userId: {
				type: Sequelize.UUID,
				references: {
					model: "course-progress-users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("protocol-decision-user");
	},
};
