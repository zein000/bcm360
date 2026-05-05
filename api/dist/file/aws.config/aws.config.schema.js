"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = void 0;
const Joi = require("joi");
exports.AWS_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
    MINIO_BUCKET: Joi.string().required(),
    MINIO_ACCESS_KEY: Joi.string().required(),
    MINIO_SECRET_KEY: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_PATHNAME: Joi.string().required(),
});
//# sourceMappingURL=aws.config.schema.js.map