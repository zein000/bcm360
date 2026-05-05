// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");

dotenv.config();

const env = process.env.NODE_ENV || "development";

module.exports = {
	[env]: {
		dialect: "mysql",
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		migrationStorageTableName: "_migrations",
		seederStorage: "sequelize",
		seederStorageTableName: "_seeders",
	},
};
