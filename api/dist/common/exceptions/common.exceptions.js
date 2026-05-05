"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBadRequestException = exports.generateMissingParamsException = exports.generateUnauthorizedException = exports.generateUnauthorizedNamedException = exports.incorrectFileFormatException = exports.unsupportedFileFormatException = exports.generateDuplicateException = exports.generateServiceNotFoundException = exports.generateNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const generateNotFoundException = (entity) => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.NOT_FOUND,
        message: `${entity} not found.`,
    }, common_1.HttpStatus.NOT_FOUND);
};
exports.generateNotFoundException = generateNotFoundException;
const generateServiceNotFoundException = () => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.NOT_FOUND,
        message: "NOT_FOUND",
    }, common_1.HttpStatus.NOT_FOUND);
};
exports.generateServiceNotFoundException = generateServiceNotFoundException;
const generateDuplicateException = (entity) => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.BAD_REQUEST,
        message: `${entity} already exists.`,
    }, common_1.HttpStatus.BAD_REQUEST);
};
exports.generateDuplicateException = generateDuplicateException;
const unsupportedFileFormatException = () => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.BAD_REQUEST,
        message: "File format is not supported.",
    }, common_1.HttpStatus.BAD_REQUEST);
};
exports.unsupportedFileFormatException = unsupportedFileFormatException;
const incorrectFileFormatException = (formats) => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.BAD_REQUEST,
        message: `File format must be one of: ${formats}.`,
    }, common_1.HttpStatus.BAD_REQUEST);
};
exports.incorrectFileFormatException = incorrectFileFormatException;
const generateUnauthorizedNamedException = (message) => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.UNAUTHORIZED,
        message: message,
    }, common_1.HttpStatus.UNAUTHORIZED);
};
exports.generateUnauthorizedNamedException = generateUnauthorizedNamedException;
const generateUnauthorizedException = () => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.UNAUTHORIZED,
        message: "Unauthorized.",
    }, common_1.HttpStatus.UNAUTHORIZED);
};
exports.generateUnauthorizedException = generateUnauthorizedException;
const generateMissingParamsException = () => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.BAD_REQUEST,
        message: "Missing parameters.",
    }, common_1.HttpStatus.BAD_REQUEST);
};
exports.generateMissingParamsException = generateMissingParamsException;
const generateBadRequestException = (message) => {
    throw new common_1.HttpException({
        statusCode: common_1.HttpStatus.BAD_REQUEST,
        message,
    }, common_1.HttpStatus.BAD_REQUEST);
};
exports.generateBadRequestException = generateBadRequestException;
//# sourceMappingURL=common.exceptions.js.map