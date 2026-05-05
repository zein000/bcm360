"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = void 0;
const Joi = require("joi");
exports.CACHE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
    CACHE_TTL: Joi.string(),
    CACHE_MAX: Joi.string(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.string().required(),
    REDIS_USERNAME: Joi.string(),
    REDIS_PASSWORD: Joi.string(),
});
//# sourceMappingURL=caching.config.schema.js.map