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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RolesSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesSeeder = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const role_enum_1 = require("../enums/role.enum");
const codes_1 = require("../permissions/enum/codes");
const permission_model_1 = require("../permissions/models/permission.model");
const role_model_1 = require("./models/role.model");
const base_roles_1 = require("./constants/base-roles");
let RolesSeeder = RolesSeeder_1 = class RolesSeeder {
    constructor(roleModel, permissionModel) {
        this.roleModel = roleModel;
        this.permissionModel = permissionModel;
        this.logger = new common_1.Logger(RolesSeeder_1.name);
    }
    async seed() {
        const permissions = await this.permissionModel.findAll();
        const adminPermissions = permissions.filter((permission) => permission.code !== codes_1.PermissionCodes.GLOBAL_ADMIN);
        const roles = [
            {
                name: "Global Admin",
                code: role_enum_1.ERole.GLOBAL_ADMIN,
                description: "Global Admin role for all organizations",
                permissions: permissions,
            },
            {
                name: "Admin",
                code: role_enum_1.ERole.ADMIN,
                description: "Admin role for organization",
                permissions: adminPermissions,
            },
            {
                name: "User",
                code: role_enum_1.ERole.USER,
                description: "User role",
                permissions: permissions.filter((permission) => base_roles_1.userPermissionCodes.includes(permission.code)),
            },
            {
                name: "Participant",
                code: role_enum_1.ERole.PARTICIPANT,
                description: "Participant role",
                permissions: permissions.filter((permission) => base_roles_1.participantPermissionCodes.includes(permission.code)),
            },
        ];
        try {
            this.logger.debug("Upserting roles");
            await this.roleModel.bulkCreate(roles, {
                updateOnDuplicate: ["name", "description", "code"],
            });
            this.logger.debug("Finished upserting roles");
        }
        catch (error) {
            this.logger.error("Failed upserting roles: ", error);
        }
        try {
            this.logger.debug("Mapping permissions to roles");
            const newRoles = await this.roleModel.findAll({
                where: {
                    code: { [sequelize_2.Op.in]: roles.map((role) => role.code) },
                },
                include: permission_model_1.default,
            });
            await Promise.all(newRoles.map((record) => {
                var _a;
                return record.$add("permissions", ((_a = roles.find((role) => role.code === record.code)) === null || _a === void 0 ? void 0 : _a.permissions) || []);
            }));
            this.logger.debug("Finished mapping permissions to roles");
        }
        catch (error) {
            this.logger.error("Failed mapping permissions to roles: ", error.message, error.stack);
        }
    }
};
exports.RolesSeeder = RolesSeeder;
exports.RolesSeeder = RolesSeeder = RolesSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(role_model_1.default)),
    __param(1, (0, sequelize_1.InjectModel)(permission_model_1.default)),
    __metadata("design:paramtypes", [Object, Object])
], RolesSeeder);
//# sourceMappingURL=roles.seeder.js.map