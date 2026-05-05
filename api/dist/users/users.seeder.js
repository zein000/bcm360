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
var UsersSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersSeeder = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const role_enum_1 = require("../enums/role.enum");
const company_model_1 = require("../company/models/company.model");
const role_model_1 = require("../roles/models/role.model");
const user_model_1 = require("./models/user.model");
const uuid_1 = require("uuid");
let UsersSeeder = UsersSeeder_1 = class UsersSeeder {
    constructor(userModel, modelCompany, roleModel) {
        this.userModel = userModel;
        this.modelCompany = modelCompany;
        this.roleModel = roleModel;
        this.logger = new common_1.Logger(UsersSeeder_1.name);
    }
    async seed() {
        const roles = await this.roleModel.findAll();
        const company = await this.modelCompany.findOne({
            where: {
                name: "Testing company",
            },
        });
        const adminRole = roles.find((role) => role.code === role_enum_1.ERole.ADMIN);
        const userRole = roles.find((role) => role.code === role_enum_1.ERole.USER);
        const globalAdminRole = roles.find((role) => role.code === role_enum_1.ERole.GLOBAL_ADMIN);
        if (!adminRole) {
            const errorMessage = "Couldn't find admin role";
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }
        const users = [
            {
                email: "globaladmin@browserbite.io",
                firstName: "super",
                lastName: "admin",
                password: "iOpCELkS2hhuWEM",
                companyId: 1,
                roleId: globalAdminRole.id,
                apiKey: (0, uuid_1.v4)(),
            },
            {
                email: "admin@browserbite.io",
                firstName: "admin",
                lastName: "admin",
                password: "iOpCELkS2hhuWEM",
                companyId: 1,
                roleId: adminRole.id,
                apiKey: (0, uuid_1.v4)(),
            },
            {
                email: "user@browserbite.io",
                firstName: "user",
                lastName: "user",
                password: "iOpCELkS2hhuWEM",
                companyId: 1,
                roleId: userRole.id,
                apiKey: (0, uuid_1.v4)(),
            },
            {
                email: "globaladmin2@browserbite.io",
                firstName: "test",
                lastName: "user",
                password: "iOpCELkS2hhuWEM",
                companyId: company.id,
                roleId: globalAdminRole.id,
                apiKey: (0, uuid_1.v4)(),
            },
            {
                email: "testuser@browserbite.io",
                firstName: "test",
                lastName: "user",
                password: "iOpCELkS2hhuWEM",
                companyId: company.id,
                roleId: adminRole.id,
                apiKey: (0, uuid_1.v4)(),
            },
            {
                email: "testcolleague@browserbite.io",
                firstName: "test",
                lastName: "colleague",
                password: "iOpCELkS2hhuWEM",
                companyId: company.id,
                roleId: adminRole.id,
                apiKey: (0, uuid_1.v4)(),
            },
        ];
        try {
            this.logger.debug("Upserting users");
            for (const user of users) {
                const foundUser = await this.userModel.findOne({
                    where: {
                        email: user.email,
                    },
                });
                if (foundUser) {
                    await foundUser.update(user);
                }
                else {
                    await this.userModel.create(user);
                }
            }
            this.logger.debug("Finished upserting users");
        }
        catch (error) {
            this.logger.error("Failed upserting users: ", error);
        }
    }
};
exports.UsersSeeder = UsersSeeder;
exports.UsersSeeder = UsersSeeder = UsersSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.default)),
    __param(1, (0, sequelize_1.InjectModel)(company_model_1.default)),
    __param(2, (0, sequelize_1.InjectModel)(role_model_1.default)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UsersSeeder);
//# sourceMappingURL=users.seeder.js.map