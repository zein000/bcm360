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
exports.GeneratedInviteLinkResponseDTO = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const codes_1 = require("../../permissions/enum/codes");
class GeneratedInviteLinkResponseDTO {
}
exports.GeneratedInviteLinkResponseDTO = GeneratedInviteLinkResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "E-Mail-Adresse des einzuladenden Nutzers" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Transform)((param) => param.value.toLowerCase()),
    __metadata("design:type", String)
], GeneratedInviteLinkResponseDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID des Kursfortschritts (courseProgressId)" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GeneratedInviteLinkResponseDTO.prototype, "courseProgressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Optionaler Vorname" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], GeneratedInviteLinkResponseDTO.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Optionaler Nachname" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], GeneratedInviteLinkResponseDTO.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Optionale Berechtigungen" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(codes_1.PermissionCodes, { each: true }),
    __metadata("design:type", Array)
], GeneratedInviteLinkResponseDTO.prototype, "permissions", void 0);
//# sourceMappingURL=generate-link.dto.js.map