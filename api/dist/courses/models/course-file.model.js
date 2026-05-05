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
const course_model_1 = require("./course.model");
const FileTypes_enum_1 = require("../../file/enum/FileTypes.enum");
const FileAssignment_enum_1 = require("../enums/FileAssignment.enum");
let CourseFile = class CourseFile extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], CourseFile.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], CourseFile.prototype, "fullFilePath", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], CourseFile.prototype, "fileName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CourseFile.prototype, "fileLength", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(FileTypes_enum_1.FileTypes)),
        allowNull: false,
        defaultValue: FileTypes_enum_1.FileTypes.Unknown,
    }),
    __metadata("design:type", String)
], CourseFile.prototype, "fileType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(FileAssignment_enum_1.FileAssignment)),
        allowNull: false,
        defaultValue: FileAssignment_enum_1.FileAssignment.Content,
    }),
    __metadata("design:type", String)
], CourseFile.prototype, "fileAssignment", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => course_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], CourseFile.prototype, "courseId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => course_model_1.default),
    __metadata("design:type", course_model_1.default)
], CourseFile.prototype, "course", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], CourseFile.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], CourseFile.prototype, "createdAt", void 0);
CourseFile = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "course-file" })
], CourseFile);
exports.default = CourseFile;
//# sourceMappingURL=course-file.model.js.map