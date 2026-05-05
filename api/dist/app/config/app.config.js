"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("app", () => {
    return {
        webAppDomain: process.env.WEB_APP_DOMAIN,
        throttleTtl: Number(process.env.THROTTLE_TTL),
        throttleLimit: Number(process.env.THROTTLE_LIMIT),
        logLevel: process.env.LOG_LEVEL || "info",
        env: process.env.NODE_ENV || "development",
        logToken: process.env.LOG_TOKEN || false,
    };
});
//# sourceMappingURL=app.config.js.map