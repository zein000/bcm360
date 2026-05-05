"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class RoleNotFoundException extends common_1.HttpException {
    constructor(message = "ROLE_NOT_FOUND", error = common_1.HttpStatus.NOT_FOUND) {
        super(message, error);
    }
}
exports.RoleNotFoundException = RoleNotFoundException;
//# sourceMappingURL=role.exceptions.js.map