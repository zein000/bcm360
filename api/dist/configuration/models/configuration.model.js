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
const sequelize_typescript_1 = require("sequelize-typescript");
const company_model_1 = require("../../company/models/company.model");
const configuration_enum_1 = require("../../enums/configuration.enum");
const configuration_history_model_1 = require("./configuration-history.model");
let Configuration = class Configuration extends sequelize_typescript_1.Model {
    static async addHistory(instance) {
        await configuration_history_model_1.default.build({
            name: instance.dataValues.name,
            valueBefore: instance.previous("value"),
            valueAfter: instance.dataValues.value,
            userId: instance.dataValues.updatedBy,
            createdAt: new Date(),
        }).save();
    }
    static async deleteHistory(instance) {
        await configuration_history_model_1.default.build({
            name: instance.dataValues.name,
            valueBefore: instance.previous("value"),
            valueAfter: instance.dataValues.value,
            userId: instance.dataValues.updatedBy,
            isDeleted: true,
            createdAt: new Date(),
        }).save();
    }
    static async upsertHistory(res) {
        const instance = res[0];
        await configuration_history_model_1.default.build({
            name: instance.dataValues.name,
            valueBefore: instance.previous("value"),
            valueAfter: instance.dataValues.value,
            userId: instance.dataValues.updatedBy,
            createdAt: new Date(),
        }).save();
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], Configuration.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM({ values: Object.values(configuration_enum_1.ConfigurationName) }),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Configuration.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Configuration.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => company_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Configuration.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => company_model_1.default),
    __metadata("design:type", company_model_1.default)
], Configuration.prototype, "company", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.VIRTUAL }),
    __metadata("design:type", Number)
], Configuration.prototype, "updatedBy", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Configuration.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Configuration.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Date)
], Configuration.prototype, "deletedAt", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Configuration]),
    __metadata("design:returntype", Promise)
], Configuration, "addHistory", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Configuration]),
    __metadata("design:returntype", Promise)
], Configuration, "deleteHistory", null);
__decorate([
    sequelize_typescript_1.AfterUpsert,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], Configuration, "upsertHistory", null);
Configuration = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "configuration",
        paranoid: true,
        indexes: [
            {
                fields: ["name", "companyId", "deletedAt"],
                unique: true,
                where: {
                    deletedAt: null,
                },
            },
        ],
    })
], Configuration);
exports.default = Configuration;
//# sourceMappingURL=configuration.model.js.map