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
const FileTypes_enum_1 = require("../../file/enum/FileTypes.enum");
const course_progress_model_1 = require("./course-progress.model");
let CourseProgressContent = class CourseProgressContent extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], CourseProgressContent.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => course_progress_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], CourseProgressContent.prototype, "courseProgressId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => course_progress_model_1.default),
    __metadata("design:type", course_progress_model_1.default)
], CourseProgressContent.prototype, "courseProgress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false }),
    __metadata("design:type", String)
], CourseProgressContent.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(FileTypes_enum_1.FileTypes)),
        allowNull: false,
        defaultValue: FileTypes_enum_1.FileTypes.Unknown,
    }),
    __metadata("design:type", String)
], CourseProgressContent.prototype, "contentType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false }),
    __metadata("design:type", Number)
], CourseProgressContent.prototype, "timeStamp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], CourseProgressContent.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CourseProgressContent.prototype, "stageNumber", void 0);
CourseProgressContent = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "course-progress-content", timestamps: false })
], CourseProgressContent);
exports.default = CourseProgressContent;
//# sourceMappingURL=course-progress-content.model.js.map