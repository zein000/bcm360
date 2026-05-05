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
const user_model_1 = require("../../users/models/user.model");
const course_tag_model_1 = require("../../courses/models/course-tag.model");
let Company = class Company extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], Company.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true }),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Company.prototype, "startDay", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => user_model_1.default, { as: "admins", onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Company.prototype, "admins", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => user_model_1.default, { as: "users", onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Company.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => course_tag_model_1.default, { as: "tags", onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Company.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Company.prototype, "deletedById", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.default),
    __metadata("design:type", user_model_1.default)
], Company.prototype, "deletedBy", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
Company = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "company", paranoid: true })
], Company);
exports.default = Company;
//# sourceMappingURL=company.model.js.map