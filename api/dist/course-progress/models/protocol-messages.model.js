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
let ProtocolMessages = class ProtocolMessages extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", String)
], ProtocolMessages.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => protocol_histories_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", String)
], ProtocolMessages.prototype, "protocolHistoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => protocol_histories_model_1.default),
    __metadata("design:type", protocol_histories_model_1.default)
], ProtocolMessages.prototype, "protocolHistory", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ProtocolMessages.prototype, "message", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], ProtocolMessages.prototype, "options", void 0);
ProtocolMessages = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "protocol-messages", timestamps: false })
], ProtocolMessages);
exports.default = ProtocolMessages;
//# sourceMappingURL=protocol-messages.model.js.map