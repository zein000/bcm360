"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("database", () => {
    var _a, _b, _c, _d, _e;
    return ({
        host: (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : process.env.host,
        port: Number((_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : process.env.port),
        username: (_c = process.env.DB_USER) !== null && _c !== void 0 ? _c : process.env.user,
        password: (_d = process.env.DB_PASSWORD) !== null && _d !== void 0 ? _d : process.env.password,
        database: (_e = process.env.DB_DATABASE) !== null && _e !== void 0 ? _e : process.env.name,
    });
});
//# sourceMappingURL=database.config.js.map