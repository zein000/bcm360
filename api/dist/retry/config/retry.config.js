"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("retry", () => {
    var _a;
    return ({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: (_a = process.env.REDIS_PASSWORD) !== null && _a !== void 0 ? _a : "",
    });
});
//# sourceMappingURL=retry.config.js.map