"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitchdeckNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class PitchdeckNotFoundException extends common_1.HttpException {
    constructor(message = "PERMISSION_NOT_FOUND", error = common_1.HttpStatus.NOT_FOUND) {
        super(message, error);
    }
}
exports.PitchdeckNotFoundException = PitchdeckNotFoundException;
//# sourceMappingURL=pitchdeck.exceptions.js.map