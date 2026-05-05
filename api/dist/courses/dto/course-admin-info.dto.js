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
exports.CourseAdminInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const company_info_dto_1 = require("../../company/dto/company-info.dto");
const course_file_info_dto_1 = require("./course-file-info.dto");
const cource_progress_info_dto_1 = require("../../course-progress/dto/cource-progress-info.dto");
const course_tag_info_dto_1 = require("./course-tag-info.dto");
class CourseAdminInfoDTO {
    constructor(data) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
exports.CourseAdminInfoDTO = CourseAdminInfoDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CourseAdminInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseAdminInfoDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseAdminInfoDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseAdminInfoDTO.prototype, "forWhom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], CourseAdminInfoDTO.prototype, "json", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => company_info_dto_1.CompanyInfoDTO }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", company_info_dto_1.CompanyInfoDTO)
], CourseAdminInfoDTO.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => course_file_info_dto_1.CourseFileInfoDTO }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CourseAdminInfoDTO.prototype, "courseFiles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => course_tag_info_dto_1.CourseTagInfoDTO }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", course_tag_info_dto_1.CourseTagInfoDTO)
], CourseAdminInfoDTO.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => cource_progress_info_dto_1.CourseProgressInfoDto }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CourseAdminInfoDTO.prototype, "courseProgresses", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CourseAdminInfoDTO.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CourseAdminInfoDTO.prototype, "createdAt", void 0);
//# sourceMappingURL=course-admin-info.dto.js.map