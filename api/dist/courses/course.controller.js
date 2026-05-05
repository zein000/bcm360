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
var CourseController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const codes_1 = require("../permissions/enum/codes");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const dto_1 = require("../common/dto");
const files_upload_dto_1 = require("../file/dtos/files-upload.dto");
const FileValidationPipe_pipe_1 = require("../file/pipes/FileValidationPipe.pipe");
const course_service_1 = require("./course.service");
const course_admin_info_dto_1 = require("./dto/course-admin-info.dto");
const course_file_info_dto_1 = require("./dto/course-file-info.dto");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const FileAssignment_enum_1 = require("./enums/FileAssignment.enum");
let CourseController = CourseController_1 = class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
        this.logger = new common_1.Logger(CourseController_1.name);
    }
    createPerson(data, { user }) {
        return this.courseService.create(data, user);
    }
    async getall(pageOptions, { user }) {
        return this.courseService.findAll(pageOptions, user);
    }
    async getAllTags({ user }) {
        return this.courseService.findAllTags(user);
    }
    async getAllRelatedCourses(id, { user }) {
        return this.courseService.findAllRelatedCourses(+id, user);
    }
    async findOne(id) {
        return this.courseService.findOne(+id);
    }
    update(params, data, { user }) {
        return this.courseService.updateAsAdmin(params.id, data, user);
    }
    upload({ user }, data) {
        return this.courseService.update(data, user);
    }
    delete(params, { user }) {
        return this.courseService.delete(params.id, user);
    }
    uploadFiles(files, fileAssignment) {
        return this.courseService.uploadCourseFiles(files, fileAssignment);
    }
    deleteFile(filePath) {
        return this.courseService.deleteCourseFile(filePath);
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.Post)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GLOBAL_ADMIN] }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({ description: "Receives image file and uploads it to AWS S3 bucket", summary: "Upload image" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDTO, Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "createPerson", null);
__decorate([
    (0, common_1.Get)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COURSES] }),
    (0, swagger_1.ApiOperation)({ summary: "Get courses", description: "Get all courses" }),
    (0, swagger_1.ApiOkResponse)({ type: course_admin_info_dto_1.CourseAdminInfoDTO, description: "company infos" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PageOptionsDTO, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getall", null);
__decorate([
    (0, common_1.Get)("tags"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COURSES] }),
    (0, swagger_1.ApiOperation)({ summary: "Get all existed tags", description: "Get all existed tags for courses" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Get)(":id/related"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COURSES] }),
    (0, swagger_1.ApiOperation)({ summary: "Get all related courses", description: "Get all related courses for course" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getAllRelatedCourses", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COURSES] }),
    (0, swagger_1.ApiOperation)({
        summary: "Get courses",
        description: `**PERMISSIONS: ${(codes_1.PermissionCodes.GLOBAL_ADMIN, codes_1.PermissionCodes.ADMIN)}**`,
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({
        permissions: [codes_1.PermissionCodes.GLOBAL_ADMIN, codes_1.PermissionCodes.ADMIN],
    }),
    (0, swagger_1.ApiOperation)({ description: "Receives image file and uploads it to AWS S3 bucket", summary: "Upload image" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_course_dto_1.UpdateCourseDTO, Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COURSES] }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({ description: "Receives image file and uploads it to AWS S3 bucket", summary: "Upload image" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_course_dto_1.UpdateCourseDTO]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({
        permissions: [codes_1.PermissionCodes.COURSES, codes_1.PermissionCodes.GLOBAL_ADMIN, codes_1.PermissionCodes.ADMIN],
    }),
    (0, swagger_1.ApiOperation)({ description: "Receives image file and uploads it to AWS S3 bucket", summary: "Upload image" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)("files/upload"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPLOAD_FILES] }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files")),
    (0, swagger_1.ApiOperation)({ description: "Receives files and uploads them to AWS S3 bucket", summary: "Upload files" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        description: "Files to upload",
        type: files_upload_dto_1.FilesUploadDto,
        isArray: true,
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: course_file_info_dto_1.CourseFileInfoDTO }),
    __param(0, (0, common_1.UploadedFiles)(FileValidationPipe_pipe_1.FileValidationPipe)),
    __param(1, (0, common_1.Body)("fileAssignment")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Delete)("file/delete"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPLOAD_FILES] }),
    (0, swagger_1.ApiOperation)({ description: "Receive file`s path and delete them from S3 bucket", summary: "Delete file" }),
    (0, swagger_1.ApiConsumes)("application/json"),
    (0, swagger_1.ApiBody)({ description: "File path", type: String }),
    __param(0, (0, common_1.Body)("filePath")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "deleteFile", null);
exports.CourseController = CourseController = CourseController_1 = __decorate([
    (0, swagger_1.ApiTags)("Scenario"),
    (0, common_1.Controller)("course"),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CourseController);
//# sourceMappingURL=course.controller.js.map