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
var PermissionsSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsSeeder = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const codes_1 = require("./enum/codes");
const permission_model_1 = require("./models/permission.model");
let PermissionsSeeder = PermissionsSeeder_1 = class PermissionsSeeder {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(PermissionsSeeder_1.name);
    }
    async seed() {
        const permissions = [
            { name: "Create role", code: codes_1.PermissionCodes.CREATE_ROLE, description: "Create role" },
            { name: "Read roles", code: codes_1.PermissionCodes.READ_ROLES, description: "Read roles" },
            { name: "Update role", code: codes_1.PermissionCodes.UPDATE_ROLE, description: "Update role" },
            { name: "Delete role", code: codes_1.PermissionCodes.DELETE_ROLE, description: "Delete role" },
            { name: "Invite user", code: codes_1.PermissionCodes.INVITE_USER, description: "Invite user" },
            { name: "Get user", code: codes_1.PermissionCodes.GET_USER, description: "Get user" },
            { name: "Get self", code: codes_1.PermissionCodes.GET_ME, description: "Get self" },
            { name: "Delete user", code: codes_1.PermissionCodes.DELETE_USER, description: "Delete user" },
            { name: "Change password", code: codes_1.PermissionCodes.CHANGE_PASSWORD, description: "Change password" },
            { name: "Update me", code: codes_1.PermissionCodes.UPDATE_ME, description: "Update me" },
            { name: "Update user", code: codes_1.PermissionCodes.UPDATE_USER, description: "Update user" },
            { name: "Update user role", code: codes_1.PermissionCodes.UPDATE_USER_ROLE, description: "Update user role" },
            { name: "Generate 2FA", code: codes_1.PermissionCodes.GENERATE_2FA, description: "Generate 2FA" },
            { name: "Get permission", code: codes_1.PermissionCodes.GET_PERMISSION, description: "Get permission" },
            { name: "Update permission", code: codes_1.PermissionCodes.UPDATE_PERMISSION, description: "Update permission" },
            { name: "Manage configuration", code: codes_1.PermissionCodes.MANAGE_CONFIGURATION, description: "Manage configuration" },
            { name: "Blacklist jwt", code: codes_1.PermissionCodes.BLACKLIST_JWT, description: "Blacklist json web token" },
            { name: "Logout", code: codes_1.PermissionCodes.LOGOUT, description: "Logout the user and blacklist their json web token" },
            { name: "Disable 2FA", code: codes_1.PermissionCodes.DISABLE_2FA, description: "Disable 2FA for the authenticated user" },
            { name: "Verify 2FA", code: codes_1.PermissionCodes.VERIFY_2FA, description: "Verifies 2FA for the authenticated user" },
            { name: "All Cookie", code: codes_1.PermissionCodes.COOKIE, description: "All Cookie" },
            { name: "All UPLOAD_FILES", code: codes_1.PermissionCodes.UPLOAD_FILES, description: "All UPLOAD_FILES" },
            { name: "All DESKTOP", code: codes_1.PermissionCodes.DESKTOP, description: "All DESKTOP" },
            { name: "All COMPANY", code: codes_1.PermissionCodes.COMPANY, description: "All COMPANY" },
            { name: "All COURSES", code: codes_1.PermissionCodes.COURSES, description: "All COURSES" },
            { name: "Global Admin", code: codes_1.PermissionCodes.GLOBAL_ADMIN, description: "GLOBAL_ADMIN" },
            { name: "Admin", code: codes_1.PermissionCodes.ADMIN, description: "ADMIN" },
            { name: "User", code: codes_1.PermissionCodes.USER, description: "USER" },
            { name: "Participant", code: codes_1.PermissionCodes.PARTICIPANT, description: "PARTICIPANT" },
            { name: "All MANAGE_COURSES", code: codes_1.PermissionCodes.MANAGE_COURSES, description: "All MANAGE_COURSES" },
            { name: "PROTOCOL_WRITER", code: codes_1.PermissionCodes.PROTOCOL_WRITER, description: "PROTOCOL_WRITER" },
        ];
        try {
            this.logger.debug("Upserting permissions");
            await this.model.bulkCreate(permissions, {
                updateOnDuplicate: ["name", "description", "code"],
            });
            this.logger.debug("Finished upserting permissions");
        }
        catch (error) {
            this.logger.error(error.message, error.stack);
        }
    }
};
exports.PermissionsSeeder = PermissionsSeeder;
exports.PermissionsSeeder = PermissionsSeeder = PermissionsSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(permission_model_1.default)),
    __metadata("design:paramtypes", [Object])
], PermissionsSeeder);
//# sourceMappingURL=permissions.seeder.js.map