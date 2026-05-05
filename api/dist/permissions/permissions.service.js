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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../common/dto");
const permission_repository_1 = require("./repositories/permission.repository");
const permission_info_dto_1 = require("./dto/permission-info.dto");
const permission_exceptions_1 = require("./exceptions/permission.exceptions");
let PermissionsService = class PermissionsService {
    constructor(permissionRepo) {
        this.permissionRepo = permissionRepo;
    }
    async findAll(pageOptions) {
        const { rows, count } = await this.permissionRepo.findAllAndCount(pageOptions.limit || 1000, pageOptions.skip);
        const pageMeta = new dto_1.PageMetaDTO({ itemCount: count, pageOptions });
        return new dto_1.PageDTO(rows.map((permission) => new permission_info_dto_1.PermissionInfoDTO(permission)), pageMeta);
    }
    async findOneById(id) {
        const permission = await this.permissionRepo.findById(id);
        if (permission) {
            return new permission_info_dto_1.PermissionInfoDTO(permission);
        }
        else {
            throw new permission_exceptions_1.PermissionNotFoundException();
        }
    }
    async update(id, data) {
        const permission = await this.permissionRepo.findById(id);
        if (!permission) {
            throw new permission_exceptions_1.PermissionNotFoundException();
        }
        await this.permissionRepo.updateById(id, data);
        const updatedPermission = await this.permissionRepo.findById(permission.id);
        return new permission_info_dto_1.PermissionInfoDTO(updatedPermission);
    }
    async delete(id) {
        const affectedCount = await this.permissionRepo.deleteById(id);
        if (affectedCount) {
            return {
                permissionId: id,
            };
        }
        else {
            throw new permission_exceptions_1.PermissionNotFoundException();
        }
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permission_repository_1.PermissionRepository])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map