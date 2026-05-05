"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("jwt", () => ({
    secret: process.env.JWT_AUTH_SECRET,
    expiration: process.env.JWT_AUTH_EXPIRE_DAYS,
    refreshSecret: process.env.JWT_REFRESH_AUTH_SECRET,
    refreshExpiration: process.env.JWT_AUTH_EXPIRE_SECONDS,
    otpSecret: process.env.JWT_OTP_AUTH_SECRET,
    otpJWTExpiration: process.env.JWT_OTP_EXPIRE_SECONDS,
}));
//# sourceMappingURL=jwt.config.js.map