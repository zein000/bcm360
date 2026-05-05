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
exports.ProtocolMessageInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const protocol_history_info_dto_1 = require("./protocol-history-info.dto");
class ProtocolMessageInfoDto {
    constructor(data) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
exports.ProtocolMessageInfoDto = ProtocolMessageInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProtocolMessageInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProtocolMessageInfoDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProtocolMessageInfoDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => protocol_history_info_dto_1.ProtocolHistoryInfoDto }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", protocol_history_info_dto_1.ProtocolHistoryInfoDto)
], ProtocolMessageInfoDto.prototype, "protocolHistory", void 0);
//# sourceMappingURL=protocol-messages-info.dto.js.map