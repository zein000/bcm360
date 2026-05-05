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
exports.CourseProgressInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const course_info_dto_1 = require("../../courses/dto/course-info.dto");
const Status_1 = require("../enum/Status");
const user_info_dto_1 = require("../../users/dto/user-info.dto");
const course_progress_user_info_dto_1 = require("./course-progress-user-info.dto");
const protocol_history_info_dto_1 = require("./protocol-history-info.dto");
const course_progress_content_dto_1 = require("./course-progress-content.dto");
class CourseProgressInfoDto {
    constructor(data) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
exports.CourseProgressInfoDto = CourseProgressInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseProgressInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseProgressInfoDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CourseProgressInfoDto.prototype, "finalPhaseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseProgressInfoDto.prototype, "scenarioEndMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => course_info_dto_1.CourseInfoDTO }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", course_info_dto_1.CourseInfoDTO)
], CourseProgressInfoDto.prototype, "course", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => user_info_dto_1.UserInfoDTO }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", user_info_dto_1.UserInfoDTO)
], CourseProgressInfoDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => course_progress_user_info_dto_1.CourseProgressUserInfoDto, isArray: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CourseProgressInfoDto.prototype, "users", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => protocol_history_info_dto_1.ProtocolHistoryInfoDto, isArray: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CourseProgressInfoDto.prototype, "protocolHistories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => course_progress_content_dto_1.CourseProgressContentInfoDto, isArray: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CourseProgressInfoDto.prototype, "content", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CourseProgressInfoDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CourseProgressInfoDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CourseProgressInfoDto.prototype, "finishDate", void 0);
//# sourceMappingURL=cource-progress-info.dto.js.map