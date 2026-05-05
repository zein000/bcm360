"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_module_1 = require("../database/database.module");
const permission_model_1 = require("./models/permission.model");
const permissions_controller_1 = require("./permissions.controller");
const permissions_seeder_1 = require("./permissions.seeder");
const permissions_service_1 = require("./permissions.service");
const permission_repository_1 = require("./repositories/permission.repository");
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, sequelize_1.SequelizeModule.forFeature([permission_model_1.default])],
        controllers: [permissions_controller_1.PermissionsController],
        providers: [permissions_service_1.PermissionsService, permission_repository_1.PermissionRepository, permissions_seeder_1.PermissionsSeeder],
        exports: [permissions_service_1.PermissionsService, permission_repository_1.PermissionRepository, permissions_seeder_1.PermissionsSeeder],
    })
], PermissionsModule);
//# sourceMappingURL=permissions.module.js.map