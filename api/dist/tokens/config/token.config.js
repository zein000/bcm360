"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("token", () => ({
    invitationTokenExpiration: process.env.INVITATION_TOKEN_EXPIRATION &&
        !isNaN(Number(process.env.INVITATION_TOKEN_EXPIRATION))
        ? Number(process.env.INVITATION_TOKEN_EXPIRATION)
        : 7 * 24 * 60 * 60 * 1000,
    forgottenPasswordTokenExpiration: process.env.FORGOTTEN_PASSWORD_TOKEN_EXPIRATION &&
        !isNaN(Number(process.env.FORGOTTEN_PASSWORD_TOKEN_EXPIRATION))
        ? Number(process.env.FORGOTTEN_PASSWORD_TOKEN_EXPIRATION)
        : 7 * 24 * 60 * 60 * 1000,
    changeEmailTokenExpiration: process.env.CHANGE_EMAIL_TOKEN_EXPIRATION &&
        !isNaN(Number(process.env.CHANGE_EMAIL_TOKEN_EXPIRATION))
        ? Number(process.env.CHANGE_EMAIL_TOKEN_EXPIRATION)
        : 7 * 24 * 60 * 60 * 1000,
}));
//# sourceMappingURL=token.config.js.map