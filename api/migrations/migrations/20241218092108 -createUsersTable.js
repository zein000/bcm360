"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("user", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			linkedinUrl: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: null,
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: null,
			},
			userLanguage: {
				type: Sequelize.ENUM("EN", "DE"),
				allowNull: false,
				defaultValue: "EN",
			},
			twoFactorAuthSecret: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			is2FAEnabled: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			isBlocked: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			autoAccept: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			status: {
				type: Sequelize.ENUM("BLOCKED", "ACTIVE", "INVITED", "EXPIRED"),
				allowNull: false,
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

		await queryInterface.addColumn("company", "deletedById", {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: "user",
				key: "id",
			},
		});

		await queryInterface.addIndex("user", ["linkedinUrl", "companyId"]);
		await queryInterface.addIndex("user", ["email", "deletedAt"], {
			unique: true,
			where: {
				deletedAt: null,
			},
		});

		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex("user", ["linkedinUrl", "companyId"]);
		await queryInterface.removeIndex("user", ["email", "deletedAt"]);
		await queryInterface.dropTable("user");

		await queryInterface.removeColumn("company", "deletedById");

		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
