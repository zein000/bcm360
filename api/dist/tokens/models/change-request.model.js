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
const token_model_1 = require("../../tokens/models/token.model");
let ChangeRequest = class ChangeRequest extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], ChangeRequest.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => token_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], ChangeRequest.prototype, "tokenId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => token_model_1.default),
    __metadata("design:type", token_model_1.default)
], ChangeRequest.prototype, "token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: false }),
    __metadata("design:type", Object)
], ChangeRequest.prototype, "changeFrom", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: false }),
    __metadata("design:type", Object)
], ChangeRequest.prototype, "changeTo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], ChangeRequest.prototype, "isAccepted", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], ChangeRequest.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], ChangeRequest.prototype, "createdAt", void 0);
ChangeRequest = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "change_request",
    })
], ChangeRequest);
exports.default = ChangeRequest;
//# sourceMappingURL=change-request.model.js.map