"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = void 0;
const Joi = require("joi");
exports.APP_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
    WEB_APP_DOMAIN: Joi.string().required(),
    THROTTLE_TTL: Joi.string().optional(),
    THROTTLE_LIMIT: Joi.string().optional(),
    NODE_ENV: Joi.string().required(),
    LOG_TOKEN: Joi.string().optional(),
    LOG_LEVEL: Joi.string().optional(),
});
//# sourceMappingURL=app.config.schema.js.map