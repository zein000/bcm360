"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("cache", () => ({
    ttl: Number(process.env.CACHE_TTL) || 5 * 60,
    scenarioTtl: Number(process.env.CACHE_SCENARIO_TTL) || 24 * 60 * 60,
    max: Number(process.env.CACHE_MAX) || 500,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
}));
//# sourceMappingURL=caching.config.js.map