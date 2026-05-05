"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIEW_ENGINE_ENVIRONMENT_VARIABLES_SCHEMA = void 0;
const Joi = require("joi");
exports.VIEW_ENGINE_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
    LAYOUTS_DIR: Joi.string(),
    PARTIALS_DIR: Joi.string(),
    VIEWS_DIR: Joi.string(),
    STATIC_ASSETS_DIR: Joi.string(),
    DEFAULT_LAYOUT: Joi.string(),
});
//# sourceMappingURL=view-engine.config.schema.js.map