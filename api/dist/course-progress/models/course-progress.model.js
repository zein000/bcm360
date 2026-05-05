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
const course_model_1 = require("../../courses/models/course.model");
const user_model_1 = require("../../users/models/user.model");
const Status_1 = require("../enum/Status");
const protocol_histories_model_1 = require("./protocol-histories.model");
const course_progress_users_model_1 = require("./course-progress-users.model");
const course_progress_content_model_1 = require("./course-progress-content.model");
let CourseProgress = class CourseProgress extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUIDV4, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], CourseProgress.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(Status_1.CourseProgressEnum)),
        allowNull: false,
        defaultValue: Status_1.CourseProgressEnum.NotStarted,
    }),
    __metadata("design:type", String)
], CourseProgress.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], CourseProgress.prototype, "finalPhaseId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], CourseProgress.prototype, "scenarioEndMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], CourseProgress.prototype, "finishDate", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => course_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CourseProgress.prototype, "courseId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => course_model_1.default),
    __metadata("design:type", course_model_1.default)
], CourseProgress.prototype, "course", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => protocol_histories_model_1.default),
    __metadata("design:type", protocol_histories_model_1.default)
], CourseProgress.prototype, "protocolHistories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => course_progress_users_model_1.default),
    __metadata("design:type", course_progress_users_model_1.default)
], CourseProgress.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => course_progress_content_model_1.default),
    __metadata("design:type", course_progress_content_model_1.default)
], CourseProgress.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CourseProgress.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.default, { as: "user" }),
    __metadata("design:type", user_model_1.default)
], CourseProgress.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], CourseProgress.prototype, "deletedById", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.default, { as: "deletedBy" }),
    __metadata("design:type", user_model_1.default)
], CourseProgress.prototype, "deletedBy", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], CourseProgress.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], CourseProgress.prototype, "createdAt", void 0);
CourseProgress = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "course-progress", paranoid: true })
], CourseProgress);
exports.default = CourseProgress;
//# sourceMappingURL=course-progress.model.js.map