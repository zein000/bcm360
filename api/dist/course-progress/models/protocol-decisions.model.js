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
const protocol_histories_model_1 = require("./protocol-histories.model");
const protocol_decision_user_model_1 = require("./protocol-decision-user.model");
const course_progress_users_model_1 = require("./course-progress-users.model");
let ProtocolDecisions = class ProtocolDecisions extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], ProtocolDecisions.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => protocol_histories_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUIDV4, allowNull: false }),
    __metadata("design:type", String)
], ProtocolDecisions.prototype, "protocolHistoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => protocol_histories_model_1.default),
    __metadata("design:type", protocol_histories_model_1.default)
], ProtocolDecisions.prototype, "protocolHistory", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ProtocolDecisions.prototype, "decision", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ProtocolDecisions.prototype, "finalDecision", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => course_progress_users_model_1.default, () => protocol_decision_user_model_1.default),
    __metadata("design:type", Array)
], ProtocolDecisions.prototype, "votedBy", void 0);
ProtocolDecisions = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "protocol-decisions", timestamps: false })
], ProtocolDecisions);
exports.default = ProtocolDecisions;
//# sourceMappingURL=protocol-decisions.model.js.map