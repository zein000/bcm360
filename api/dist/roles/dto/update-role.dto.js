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
exports.UpdateRoleDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_role_dto_1 = require("./create-role.dto");
class UpdateRoleDTO extends create_role_dto_1.CreateRoleDTO {
}
exports.UpdateRoleDTO = UpdateRoleDTO;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Role's name." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateRoleDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Role's code - the unique identifier." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)((data) => data.value.toUpperCase()),
    __metadata("design:type", String)
], UpdateRoleDTO.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Role's description." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoleDTO.prototype, "description", void 0);
//# sourceMappingURL=update-role.dto.js.map