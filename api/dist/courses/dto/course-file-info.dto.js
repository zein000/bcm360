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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseFileInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const course_info_dto_1 = require("./course-info.dto");
const FileTypes_enum_1 = require("../../file/enum/FileTypes.enum");
const FileAssignment_enum_1 = require("../enums/FileAssignment.enum");
class CourseFileInfoDTO {
    constructor(data) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
exports.CourseFileInfoDTO = CourseFileInfoDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CourseFileInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseFileInfoDTO.prototype, "fullFilePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseFileInfoDTO.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CourseFileInfoDTO.prototype, "fileLength", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseFileInfoDTO.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseFileInfoDTO.prototype, "fileAssignment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => course_info_dto_1.CourseInfoDTO }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", course_info_dto_1.CourseInfoDTO)
], CourseFileInfoDTO.prototype, "course", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CourseFileInfoDTO.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CourseFileInfoDTO.prototype, "createdAt", void 0);
//# sourceMappingURL=course-file-info.dto.js.map