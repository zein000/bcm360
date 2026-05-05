"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class PermissionNotFoundException extends common_1.HttpException {
    constructor(message = "PERMISSION_NOT_FOUND", error = common_1.HttpStatus.NOT_FOUND) {
        super(message, error);
    }
}
exports.PermissionNotFoundException = PermissionNotFoundException;
//# sourceMappingURL=permission.exceptions.js.map