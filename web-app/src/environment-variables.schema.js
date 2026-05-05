const { z } = require("zod"); // eslint-disable-line

module.exports = {
	ENVIRONMENT_VARIABLES_SCHEMA: z.object({
		REACT_APP_API_URL: z.string().url().min(1),
		REACT_APP_NODE_ENV: z.enum(["development", "production"]),
	}),
};
