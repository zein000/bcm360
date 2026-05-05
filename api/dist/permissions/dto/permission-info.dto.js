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
exports.PermissionInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const role_info_dto_1 = require("../../roles/dto/role-info.dto");
const role_permission_model_1 = require("../../roles/models/role-permission.model");
class PermissionInfoDTO {
    constructor(data) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
exports.PermissionInfoDTO = PermissionInfoDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Internal unique identifier for permission." }),
    __metadata("design:type", Number)
], PermissionInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Permission's name." }),
    __metadata("design:type", String)
], PermissionInfoDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Permission's code - the unique identifier." }),
    __metadata("design:type", String)
], PermissionInfoDTO.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Permission's description." }),
    __metadata("design:type", String)
], PermissionInfoDTO.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], PermissionInfoDTO.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], PermissionInfoDTO.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: role_info_dto_1.RoleInfoDTO,
        isArray: true,
        description: "Roles that use this permission.",
    }),
    (0, class_transformer_1.Type)(() => role_info_dto_1.RoleInfoDTO),
    __metadata("design:type", Array)
], PermissionInfoDTO.prototype, "roles", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", role_permission_model_1.default)
], PermissionInfoDTO.prototype, "RolePermission", void 0);
//# sourceMappingURL=permission-info.dto.js.map