"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = void 0;
const Joi = require("joi");
exports.JWT_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
    JWT_AUTH_SECRET: Joi.string().required(),
    JWT_AUTH_EXPIRE_DAYS: Joi.string().required(),
    JWT_REFRESH_AUTH_SECRET: Joi.string().required(),
    JWT_REFRESH_AUTH_EXPIRE_DAYS: Joi.string().required(),
    JWT_OTP_AUTH_SECRET: Joi.string().required(),
    JWT_OTP_EXPIRE_SECONDS: Joi.string().required(),
});
//# sourceMappingURL=jwt.config.schema.js.map