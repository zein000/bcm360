"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("email", () => ({
    key: process.env.EMAIL_KEY,
    pass: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_ADDRESS || "template@browserbite.dev",
    feedbackTo: process.env.EMAIL_FEEDBACK_TO || "template@browserbite.dev",
}));
//# sourceMappingURL=mail.config.js.map