"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = void 0;
const Joi = require("joi");
exports.EMAIL_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
    EMAIL_KEY: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),
    EMAIL_ADDRESS: Joi.string().required(),
    EMAIL_FEEDBACK_TO: Joi.string().required(),
});
//# sourceMappingURL=mail.config.schema.js.map