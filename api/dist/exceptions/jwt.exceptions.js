"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAlreadyBlacklisted = void 0;
const common_1 = require("@nestjs/common");
const errors_enum_1 = require("../enums/errors.enum");
class JwtAlreadyBlacklisted extends common_1.HttpException {
    constructor(message = errors_enum_1.Errors.JWT_ALREADY_BLACKLISTED, error = common_1.HttpStatus.BAD_REQUEST) {
        super(message, error);
    }
}
exports.JwtAlreadyBlacklisted = JwtAlreadyBlacklisted;
//# sourceMappingURL=jwt.exceptions.js.map