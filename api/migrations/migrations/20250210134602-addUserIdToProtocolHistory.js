"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("protocol-histories", "userId", {
      type: Sequelize.UUID,
      references: {
        model: "course-progress-users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: true,
    },);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("protocol-histories", "userId");
	},
};
