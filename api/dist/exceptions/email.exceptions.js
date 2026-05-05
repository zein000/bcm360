"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFailedException = void 0;
const common_1 = require("@nestjs/common");
class EmailFailedException extends common_1.HttpException {
    constructor(message = "Failed to send email.", error = common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message, error);
    }
}
exports.EmailFailedException = EmailFailedException;
//# sourceMappingURL=email.exceptions.js.map