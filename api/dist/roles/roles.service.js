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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("@nestjs/common/exceptions");
const errors_enum_1 = require("../enums/errors.enum");
const role_enum_1 = require("../enums/role.enum");
const user_util_1 = require("../common/user.util");
const codes_1 = require("../permissions/enum/codes");
const dto_1 = require("../common/dto");
const role_info_dto_1 = require("./dto/role-info.dto");
const role_exceptions_1 = require("./exceptions/role.exceptions");
const role_repository_1 = require("./repositories/role.repository");
const permission_model_1 = require("../permissions/models/permission.model");
const permission_repository_1 = require("../permissions/repositories/permission.repository");
let RolesService = class RolesService {
    constructor(roleRepo, permissionRepo) {
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
    }
    async create(data) {
        const { permissions } = data, roleData = __rest(data, ["permissions"]);
        const role = this.roleRepo.build(roleData);
        const result = await this.roleRepo.save(role);
        if (permissions === null || permissions === void 0 ? void 0 : permissions.length) {
            const permissionResult = await this.permissionRepo.findByCodes(permissions);
            await result.$add("permissions", permissionResult);
        }
        const newResult = await role.reload({ include: permission_model_1.default });
        return new role_info_dto_1.RoleInfoDTO(newResult);
    }
    async findAll(user, pageOptions) {
        const types = [role_enum_1.ERole.USER];
        if ((0, user_util_1.hasPermission)(user, codes_1.PermissionCodes.GLOBAL_ADMIN)) {
            types.push(role_enum_1.ERole.GLOBAL_ADMIN);
        }
        if ((0, user_util_1.hasPermission)(user, codes_1.PermissionCodes.ADMIN)) {
            types.push(role_enum_1.ERole.ADMIN);
        }
        const { rows, count } = await this.roleRepo.findAllAndCount(pageOptions.limit, pageOptions.skip, types);
        const pageMeta = new dto_1.PageMetaDTO({ itemCount: count, pageOptions });
        return new dto_1.PageDTO(rows.map((role) => new role_info_dto_1.RoleInfoDTO(role)), pageMeta);
    }
    async findOneById(id) {
        const role = await this.roleRepo.findById(id);
        if (!role)
            throw new role_exceptions_1.RoleNotFoundException();
        return new role_info_dto_1.RoleInfoDTO(role);
    }
    async findOneRoleById(id) {
        const role = await this.roleRepo.findById(id);
        if (!role)
            throw new role_exceptions_1.RoleNotFoundException();
        return role;
    }
    async findOneByCode(code) {
        const role = await this.roleRepo.findOneByCode(code);
        if (!role)
            throw new role_exceptions_1.RoleNotFoundException();
        return role;
    }
    async findManyByCode(codes) {
        const roles = await this.roleRepo.findManyByCode(codes);
        if (!roles.length)
            throw new role_exceptions_1.RoleNotFoundException();
        return roles;
    }
    async update(id, data) {
        const role = await this.roleRepo.findById(id);
        if (!role)
            throw new role_exceptions_1.RoleNotFoundException();
        const { permissions } = data, roleData = __rest(data, ["permissions"]);
        await this.roleRepo.update(role.id, roleData);
        if (permissions === null || permissions === void 0 ? void 0 : permissions.length) {
            const permissionResult = await this.permissionRepo.findByCodes(permissions);
            await role.$set("permissions", permissionResult);
        }
        const newResult = await role.reload({ include: permission_model_1.default });
        return new role_info_dto_1.RoleInfoDTO(newResult);
    }
    async assignPermissions(id, data) {
        var _a, _b;
        const role = await this.roleRepo.findById(id);
        if (!role)
            throw new role_exceptions_1.RoleNotFoundException();
        const allCodes = [...((_b = (_a = role.permissions) === null || _a === void 0 ? void 0 : _a.map((p) => p.code)) !== null && _b !== void 0 ? _b : []), ...data.permissions];
        const permissionResult = await this.permissionRepo.findByCodes(allCodes);
        await role.$add("permissions", permissionResult);
        const updatedRole = await this.roleRepo.findById(role.id);
        return new role_info_dto_1.RoleInfoDTO(updatedRole);
    }
    async unassignPermissions(id, data) {
        const role = await this.roleRepo.findById(id);
        if (!role)
            throw new role_exceptions_1.RoleNotFoundException();
        const remainingPermissions = role.permissions.filter((p) => !data.permissions.includes(p.code));
        const remainingPermissionEntities = await this.permissionRepo.findByIds(remainingPermissions.map((p) => p.id));
        await role.$set("permissions", remainingPermissionEntities);
        const updatedRole = await this.roleRepo.findById(role.id);
        return new role_info_dto_1.RoleInfoDTO(updatedRole);
    }
    async delete(id) {
        const role = await this.roleRepo.findById(id);
        if (!role)
            throw new role_exceptions_1.RoleNotFoundException();
        try {
            await this.roleRepo.delete(role);
            return { roleId: id };
        }
        catch (error) {
            throw new exceptions_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR, "Failed to remove the role.");
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_repository_1.RoleRepository,
        permission_repository_1.PermissionRepository])
], RolesService);
//# sourceMappingURL=roles.service.js.map