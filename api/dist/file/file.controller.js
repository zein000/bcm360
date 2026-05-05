"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const file_service_1 = require("./file.service");
const files_upload_dto_1 = require("./dtos/files-upload.dto");
const FileValidationPipe_pipe_1 = require("./pipes/FileValidationPipe.pipe");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const codes_1 = require("../permissions/enum/codes");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    uploadFiles(files) {
        return this.fileService.uploadFiles(files, true);
    }
    deleteFile(filePath) {
        return this.fileService.deleteFile(filePath);
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.Post)("upload"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPLOAD_FILES] }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files")),
    (0, swagger_1.ApiOperation)({
        summary: "Upload files",
        description: "Receives files and uploads them to AWS S3 bucket",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        description: "Files to upload",
        type: files_upload_dto_1.FilesUploadDto,
        isArray: true,
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: "Images link on AWS" }),
    __param(0, (0, common_1.UploadedFiles)(FileValidationPipe_pipe_1.FileValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Post)("delete"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPLOAD_FILES] }),
    (0, swagger_1.ApiOperation)({
        summary: "Delete file",
        description: "Receive file's path and delete them from S3 bucket",
    }),
    (0, swagger_1.ApiConsumes)("application/json"),
    (0, swagger_1.ApiBody)({
        description: "File path",
        type: String,
    }),
    __param(0, (0, common_1.Body)("filePath")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "deleteFile", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)("files"),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
//# sourceMappingURL=file.controller.js.map