'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("permission", {
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("permission");
  }
};
