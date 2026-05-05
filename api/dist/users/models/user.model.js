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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const class_transformer_1 = require("class-transformer");
const constants_1 = require("../../constants");
const role_model_1 = require("../../roles/models/role.model");
const company_model_1 = require("../../company/models/company.model");
const user_exceptions_1 = require("../../exceptions/user.exceptions");
const user_enum_1 = require("../../enums/user.enum");
const user_status_enum_1 = require("../../enums/user-status.enum");
const token_config_1 = require("../../tokens/config/token.config");
const token_model_1 = require("../../tokens/models/token.model");
const course_progress_model_1 = require("../../course-progress/models/course-progress.model");
const bcrypt = require("bcryptjs");
let User = User_1 = class User extends sequelize_typescript_1.Model {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(User_1.name);
        this.getTokenCompareDate = () => {
            const compareDate = new Date();
            return new Date(compareDate.getTime() - Number((0, token_config_1.default)().invitationTokenExpiration));
        };
    }
    async checkPassword(passwordToCheck) {
        if (!this.password) {
            throw new user_exceptions_1.IncorrectInputDataException();
        }
        return await bcrypt.compare(passwordToCheck, this.password);
    }
    isExpired(createdAt) {
        return createdAt.getTime() <= this.getTokenCompareDate().getTime();
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), unique: "column", allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        set(val) {
            this.setDataValue("password", bcrypt.hashSync(val, constants_1.BCRYPT_HASH_SALT_ROUNDS));
        },
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => role_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], User.prototype, "roleId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => role_model_1.default),
    __metadata("design:type", role_model_1.default)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true, defaultValue: null }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true, defaultValue: null }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM({ values: Object.values(user_enum_1.UserLanguage) }),
        allowNull: false,
        defaultValue: user_enum_1.UserLanguage.EN,
    }),
    __metadata("design:type", String)
], User.prototype, "userLanguage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true }),
    __metadata("design:type", String)
], User.prototype, "twoFactorAuthSecret", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true }),
    __metadata("design:type", String)
], User.prototype, "linkedinUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is2FAEnabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isBlocked", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], User.prototype, "autoAccept", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => company_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], User.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => company_model_1.default),
    __metadata("design:type", company_model_1.default)
], User.prototype, "company", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => token_model_1.default, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => course_progress_model_1.default),
    __metadata("design:type", Array)
], User.prototype, "courseProgresses", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUIDV4, allowNull: true, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], User.prototype, "apiKey", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
        get: function () {
            var _a;
            if (this.isBlocked) {
                return user_status_enum_1.UserStatus.BLOCKED;
            }
            else if (this.password) {
                return user_status_enum_1.UserStatus.ACTIVE;
            }
            else if (((_a = this.tokens) === null || _a === void 0 ? void 0 : _a.length) === 1 && this.isExpired(this.tokens[0].createdAt)) {
                return user_status_enum_1.UserStatus.EXPIRED;
            }
            return user_status_enum_1.UserStatus.INVITED;
        },
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], User.prototype, "deletedById", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User),
    __metadata("design:type", User)
], User.prototype, "deletedBy", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
User = User_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "user",
        paranoid: true,
        indexes: [
            {
                type: "FULLTEXT",
                fields: ["firstName", "lastName"],
                unique: false,
                where: { deletedAt: null },
            },
            {
                fields: ["email", "deletedAt"],
                unique: true,
                where: { deletedAt: null },
            },
        ],
    })
], User);
exports.default = User;
//# sourceMappingURL=user.model.js.map