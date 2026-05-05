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
const ScenarioMessageTypes_enum_1 = require("../enum/ScenarioMessageTypes.enum");
const course_progress_model_1 = require("./course-progress.model");
const protocol_decisions_model_1 = require("./protocol-decisions.model");
const protocol_messages_model_1 = require("./protocol-messages.model");
const course_progress_users_model_1 = require("./course-progress-users.model");
let ProtocolHistories = class ProtocolHistories extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", String)
], ProtocolHistories.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(ScenarioMessageTypes_enum_1.ScenarioMessageTypes)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProtocolHistories.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => course_progress_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUIDV4, allowNull: false }),
    __metadata("design:type", String)
], ProtocolHistories.prototype, "courseProgressId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => course_progress_model_1.default),
    __metadata("design:type", course_progress_model_1.default)
], ProtocolHistories.prototype, "courseProgress", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => protocol_decisions_model_1.default),
    __metadata("design:type", protocol_decisions_model_1.default)
], ProtocolHistories.prototype, "protocolDecisions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => protocol_messages_model_1.default),
    __metadata("design:type", protocol_messages_model_1.default)
], ProtocolHistories.prototype, "protocolMessages", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => course_progress_users_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUIDV4, allowNull: true }),
    __metadata("design:type", String)
], ProtocolHistories.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => course_progress_users_model_1.default),
    __metadata("design:type", course_progress_users_model_1.default)
], ProtocolHistories.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT }),
    __metadata("design:type", Number)
], ProtocolHistories.prototype, "timestamp", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], ProtocolHistories.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], ProtocolHistories.prototype, "updatedAt", void 0);
ProtocolHistories = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "protocol-histories" })
], ProtocolHistories);
exports.default = ProtocolHistories;
//# sourceMappingURL=protocol-histories.model.js.map