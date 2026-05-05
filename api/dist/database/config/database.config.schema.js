"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = void 0;
const Joi = require("joi");
exports.DATABASE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
});
//# sourceMappingURL=database.config.schema.js.map