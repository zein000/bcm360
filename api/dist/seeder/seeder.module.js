"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_module_1 = require("../database/database.module");
const permissions_module_1 = require("../permissions/permissions.module");
const roles_module_1 = require("../roles/roles.module");
const users_module_1 = require("../users/users.module");
const company_module_1 = require("../company/company.module");
const features_module_1 = require("../features/features.module");
const course_module_1 = require("../courses/course.module");
const migration_model_1 = require("./models/migration.model");
const seed_model_1 = require("./models/seed.model");
const seeder_1 = require("./seeder");
let SeederModule = class SeederModule {
};
exports.SeederModule = SeederModule;
exports.SeederModule = SeederModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([seed_model_1.default, migration_model_1.default]),
            database_module_1.DatabaseModule,
            roles_module_1.RolesModule,
            users_module_1.UsersModule,
            permissions_module_1.PermissionsModule,
            company_module_1.CompanyModule,
            course_module_1.CourseModule,
            features_module_1.FeaturesModule,
        ],
        providers: [seeder_1.Seeder],
    })
], SeederModule);
//# sourceMappingURL=seeder.module.js.map