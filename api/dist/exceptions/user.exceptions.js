"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenException = exports.IncorrectCredentialsException = exports.IncorrectInputDataException = exports.DuplicateUserException = exports.DuplicateServiceUserException = exports.UserNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const errors_enum_1 = require("../enums/errors.enum");
class UserNotFoundException extends common_1.HttpException {
    constructor(message = errors_enum_1.Errors.USER_NOT_FOUND, error = common_1.HttpStatus.NOT_FOUND) {
        super(message, error);
    }
}
exports.UserNotFoundException = UserNotFoundException;
class DuplicateServiceUserException extends common_1.HttpException {
    constructor(message = errors_enum_1.Errors.USER_ALREADY_EXISTS, error = common_1.HttpStatus.BAD_REQUEST) {
        super(message, error);
    }
}
exports.DuplicateServiceUserException = DuplicateServiceUserException;
class DuplicateUserException extends common_1.HttpException {
    constructor(message = errors_enum_1.Errors.EMAIL_ALREADY_TAKEN, error = common_1.HttpStatus.BAD_REQUEST) {
        super(message, error);
    }
}
exports.DuplicateUserException = DuplicateUserException;
class IncorrectInputDataException extends common_1.HttpException {
    constructor(message = errors_enum_1.Errors.INVALID_REQUEST_DATA, error = common_1.HttpStatus.BAD_REQUEST) {
        super(message, error);
    }
}
exports.IncorrectInputDataException = IncorrectInputDataException;
class IncorrectCredentialsException extends common_1.HttpException {
    constructor(message = errors_enum_1.Errors.INVALID_CREDENTIALS, error = common_1.HttpStatus.UNAUTHORIZED) {
        super(message, error);
    }
}
exports.IncorrectCredentialsException = IncorrectCredentialsException;
class InvalidTokenException extends common_1.HttpException {
    constructor(message = errors_enum_1.Errors.INVALID_TOKEN, error = common_1.HttpStatus.UNAUTHORIZED) {
        super(message, error);
    }
}
exports.InvalidTokenException = InvalidTokenException;
//# sourceMappingURL=user.exceptions.js.map