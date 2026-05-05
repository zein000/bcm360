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
exports.RoleInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const permission_info_dto_1 = require("../../permissions/dto/permission-info.dto");
const role_permission_model_1 = require("../models/role-permission.model");
class RoleInfoDTO {
    constructor(data) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
exports.RoleInfoDTO = RoleInfoDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Internal unique identifier for role." }),
    __metadata("design:type", Number)
], RoleInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Role's name." }),
    __metadata("design:type", String)
], RoleInfoDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Role's code - the unique identifier." }),
    __metadata("design:type", String)
], RoleInfoDTO.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Role's description." }),
    __metadata("design:type", String)
], RoleInfoDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: permission_info_dto_1.PermissionInfoDTO, description: "Role's permissions.", isArray: true }),
    (0, class_transformer_1.Type)(() => permission_info_dto_1.PermissionInfoDTO),
    __metadata("design:type", Array)
], RoleInfoDTO.prototype, "permissions", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], RoleInfoDTO.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], RoleInfoDTO.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", role_permission_model_1.default)
], RoleInfoDTO.prototype, "RolePermission", void 0);
//# sourceMappingURL=role-info.dto.js.map