"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = void 0;
const Joi = require("joi");
exports.TOKEN_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
    INVITATION_TOKEN_EXPIRATION: Joi.string(),
    FORGOTTEN_PASSWORD_TOKEN_EXPIRATION: Joi.string(),
});
//# sourceMappingURL=token.config.schema.js.map