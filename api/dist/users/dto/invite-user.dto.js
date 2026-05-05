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
exports.InviteUserDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class InviteUserDTO {
}
exports.InviteUserDTO = InviteUserDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's email" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Transform)((param) => param.value.toLowerCase()),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's first name" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's last name" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "User's role" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's roleId" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => +value),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InviteUserDTO.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's company if created by global admin" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => +value),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InviteUserDTO.prototype, "companyId", void 0);
//# sourceMappingURL=invite-user.dto.js.map