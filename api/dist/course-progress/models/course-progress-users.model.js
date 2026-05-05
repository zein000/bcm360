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
const course_progress_model_1 = require("./course-progress.model");
const protocol_decision_user_model_1 = require("./protocol-decision-user.model");
const protocol_decisions_model_1 = require("./protocol-decisions.model");
let CourseProgressUsers = class CourseProgressUsers extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], CourseProgressUsers.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => course_progress_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUIDV4, allowNull: false }),
    __metadata("design:type", String)
], CourseProgressUsers.prototype, "courseProgressId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => course_progress_model_1.default),
    __metadata("design:type", course_progress_model_1.default)
], CourseProgressUsers.prototype, "courseProgress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], CourseProgressUsers.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], CourseProgressUsers.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], CourseProgressUsers.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false }),
    __metadata("design:type", Number)
], CourseProgressUsers.prototype, "firstJoinTimeStamp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false }),
    __metadata("design:type", Number)
], CourseProgressUsers.prototype, "exitTimeStamp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false }),
    __metadata("design:type", Number)
], CourseProgressUsers.prototype, "invitedTimeStamp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], CourseProgressUsers.prototype, "isAccepted", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], CourseProgressUsers.prototype, "isERR", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => protocol_decisions_model_1.default, () => protocol_decision_user_model_1.default),
    __metadata("design:type", Array)
], CourseProgressUsers.prototype, "votedFor", void 0);
CourseProgressUsers = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "course-progress-users", timestamps: false })
], CourseProgressUsers);
exports.default = CourseProgressUsers;
//# sourceMappingURL=course-progress-users.model.js.map