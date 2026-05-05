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
exports.CourseProgressContentInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const FileTypes_enum_1 = require("../../file/enum/FileTypes.enum");
const cource_progress_info_dto_1 = require("./cource-progress-info.dto");
class CourseProgressContentInfoDto {
    constructor(data) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
exports.CourseProgressContentInfoDto = CourseProgressContentInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseProgressContentInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseProgressContentInfoDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CourseProgressContentInfoDto.prototype, "stageNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseProgressContentInfoDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseProgressContentInfoDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CourseProgressContentInfoDto.prototype, "timeStamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => cource_progress_info_dto_1.CourseProgressInfoDto }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", cource_progress_info_dto_1.CourseProgressInfoDto)
], CourseProgressContentInfoDto.prototype, "courseProgress", void 0);
//# sourceMappingURL=course-progress-content.dto.js.map