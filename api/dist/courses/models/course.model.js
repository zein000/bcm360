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
const company_model_1 = require("../../company/models/company.model");
const course_progress_model_1 = require("../../course-progress/models/course-progress.model");
const course_file_model_1 = require("./course-file.model");
const course_tag_model_1 = require("./course-tag.model");
let Course = class Course extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], Course.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true }),
    __metadata("design:type", String)
], Course.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], Course.prototype, "forWhom", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: true }),
    __metadata("design:type", Object)
], Course.prototype, "json", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => company_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Course.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => company_model_1.default),
    __metadata("design:type", company_model_1.default)
], Course.prototype, "company", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => course_tag_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Course.prototype, "tagId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => course_tag_model_1.default),
    __metadata("design:type", course_tag_model_1.default)
], Course.prototype, "tag", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Course.prototype, "deletedById", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.default),
    __metadata("design:type", user_model_1.default)
], Course.prototype, "deletedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => course_file_model_1.default),
    __metadata("design:type", Array)
], Course.prototype, "courseFiles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => course_progress_model_1.default),
    __metadata("design:type", Array)
], Course.prototype, "courseProgresses", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Course.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Course.prototype, "createdAt", void 0);
Course = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "course", paranoid: true })
], Course);
exports.default = Course;
//# sourceMappingURL=course.model.js.map