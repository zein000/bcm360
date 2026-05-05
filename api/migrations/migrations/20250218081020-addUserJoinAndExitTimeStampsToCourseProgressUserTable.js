"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("course-progress-users", "invitedTimeStamp", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
		await queryInterface.addColumn("course-progress-users", "firstJoinTimeStamp", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
    await queryInterface.addColumn("course-progress-users", "exitTimeStamp", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("course-progress-users", "invitedTimeStamp");
		await queryInterface.removeColumn("course-progress-users", "firstJoinTimeStamp");
		await queryInterface.removeColumn("course-progress-users", "exitTimeStamp");
	},
};
