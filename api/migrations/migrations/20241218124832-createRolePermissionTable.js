"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("role_permission", {
			roleId: {
				type: Sequelize.INTEGER,
				references: {
					model: "role",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: false,
			},
			permissionId: {
				type: Sequelize.INTEGER,
				references: {
					model: "permission",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: false,
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

		await queryInterface.addConstraint("role_permission", {
			fields: ["roleId", "permissionId"],
			type: "unique",
			name: "role_permission_roleId_permissionId_unique",
		});

		await queryInterface.addIndex("role_permission", ["permissionId"]);
	},

	async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("role_permission", ["permissionId"]);
		await queryInterface.dropTable("role_permission");
	},
};
