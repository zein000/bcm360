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
exports.Seeder = void 0;
const common_1 = require("@nestjs/common");
const users_seeder_1 = require("../users/users.seeder");
const company_seeder_1 = require("../company/company.seeder");
const features_seeder_1 = require("../features/features.seeder");
const permissions_seeder_1 = require("../permissions/permissions.seeder");
const roles_seeder_1 = require("../roles/roles.seeder");
const course_seeder_1 = require("../courses/course.seeder");
let Seeder = class Seeder {
    constructor(permissionsSeeder, rolesSeeder, usersSeeder, companySeeder, coursesSeeder, featuresSeeder) {
        this.permissionsSeeder = permissionsSeeder;
        this.rolesSeeder = rolesSeeder;
        this.usersSeeder = usersSeeder;
        this.companySeeder = companySeeder;
        this.coursesSeeder = coursesSeeder;
        this.featuresSeeder = featuresSeeder;
        this.logger = new common_1.Logger();
    }
    onModuleInit() {
        if (process.env.NODE_ENV === "test") {
            return;
        }
        if (process.env.NODE_ENV === "development") {
            this.seed();
        }
        else {
            this.productionSeed();
        }
    }
    async productionSeed() {
        try {
            await this.permissionsSeeder.seed();
            await this.rolesSeeder.seed();
            await this.companySeeder.seed();
            await this.usersSeeder.seed();
            await this.featuresSeeder.seed();
            await this.coursesSeeder.seed();
            this.logger.debug("Seeding passed!");
        }
        catch (error) {
            this.logger.warn("Seeding failed!");
            this.logger.error(error.message, error.stack);
        }
    }
    async seed() {
        try {
            await this.permissionsSeeder.seed();
            await this.rolesSeeder.seed();
            await this.companySeeder.seed();
            await this.usersSeeder.seed();
            await this.featuresSeeder.seed();
            await this.coursesSeeder.seed();
            this.logger.debug("Seeding passed!");
        }
        catch (error) {
            this.logger.warn("Seeding failed!");
            this.logger.error(error.message, error.stack);
        }
    }
};
exports.Seeder = Seeder;
exports.Seeder = Seeder = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permissions_seeder_1.PermissionsSeeder,
        roles_seeder_1.RolesSeeder,
        users_seeder_1.UsersSeeder,
        company_seeder_1.CompanySeeder,
        course_seeder_1.CourseSeeder,
        features_seeder_1.FeaturesSeeder])
], Seeder);
//# sourceMappingURL=seeder.js.map