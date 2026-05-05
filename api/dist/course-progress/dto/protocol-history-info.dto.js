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
exports.ProtocolHistoryInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ScenarioMessageTypes_enum_1 = require("../enum/ScenarioMessageTypes.enum");
const cource_progress_info_dto_1 = require("./cource-progress-info.dto");
const class_transformer_1 = require("class-transformer");
const protocol_decision_info_dto_1 = require("./protocol-decision-info.dto");
const protocol_messages_info_dto_1 = require("./protocol-messages-info.dto");
const course_progress_user_info_dto_1 = require("./course-progress-user-info.dto");
class ProtocolHistoryInfoDto {
    constructor(data) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
exports.ProtocolHistoryInfoDto = ProtocolHistoryInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProtocolHistoryInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProtocolHistoryInfoDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProtocolHistoryInfoDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => cource_progress_info_dto_1.CourseProgressInfoDto }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", cource_progress_info_dto_1.CourseProgressInfoDto)
], ProtocolHistoryInfoDto.prototype, "courseProgress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => protocol_decision_info_dto_1.ProtocolDecisionInfoDto, nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", protocol_decision_info_dto_1.ProtocolDecisionInfoDto)
], ProtocolHistoryInfoDto.prototype, "protocolDecisions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => protocol_messages_info_dto_1.ProtocolMessageInfoDto, nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", protocol_messages_info_dto_1.ProtocolMessageInfoDto)
], ProtocolHistoryInfoDto.prototype, "protocolMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => course_progress_user_info_dto_1.CourseProgressUserInfoDto }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", course_progress_user_info_dto_1.CourseProgressUserInfoDto)
], ProtocolHistoryInfoDto.prototype, "user", void 0);
//# sourceMappingURL=protocol-history-info.dto.js.map