require("dotenv").config(); // eslint-disable-line
const path = require("path"); // eslint-disable-line
const { ENVIRONMENT_VARIABLES_SCHEMA } = require("./src/environment-variables.schema"); // eslint-disable-line

ENVIRONMENT_VARIABLES_SCHEMA.parse(process.env);

module.exports = {
	webpack: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@app": path.resolve(__dirname, "./src/app"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@assets": path.resolve(__dirname, "./src/assets"),
		},
	},
};
