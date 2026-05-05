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
exports.UserInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const role_info_dto_1 = require("../../roles/dto/role-info.dto");
const user_enum_1 = require("../../enums/user.enum");
const company_info_dto_1 = require("../../company/dto/company-info.dto");
const user_status_enum_1 = require("../../enums/user-status.enum");
const user_model_1 = require("../models/user.model");
let UserInfoDTO = class UserInfoDTO {
    constructor(data) {
        var _a, _b;
        let company;
        if (((_a = data === null || data === void 0 ? void 0 : data.dataValues) === null || _a === void 0 ? void 0 : _a.company) || (data === null || data === void 0 ? void 0 : data.company)) {
            company = new company_info_dto_1.CompanyInfoDTO(((_b = data === null || data === void 0 ? void 0 : data.dataValues) === null || _b === void 0 ? void 0 : _b.company) || (data === null || data === void 0 ? void 0 : data.company));
            if (data === null || data === void 0 ? void 0 : data.dataValues) {
                data.dataValues.company = company;
            }
        }
        Object.assign(this, data.dataValues
            ? data.toJSON()
            : Object.assign(Object.assign({}, data), { company: company ? company : undefined }));
    }
};
exports.UserInfoDTO = UserInfoDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Internal unique identifier for admin." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UserInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's first name." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's last name." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's language." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "userLanguage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's email." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's useragent." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "customUa", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User's linkedinUrl." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "linkedinUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Is user blocked." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserInfoDTO.prototype, "isBlocked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Linkedin autoAccept." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserInfoDTO.prototype, "autoAccept", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Current user status" }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => role_info_dto_1.RoleInfoDTO, description: "User's role." }),
    (0, class_transformer_1.Type)(() => role_info_dto_1.RoleInfoDTO),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", role_info_dto_1.RoleInfoDTO)
], UserInfoDTO.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => company_info_dto_1.CompanyInfoDTO }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", company_info_dto_1.CompanyInfoDTO)
], UserInfoDTO.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Is 2fa enabled." }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserInfoDTO.prototype, "is2FAEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "apiKey for authorization" }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "courseProgressId for participants" }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "courseProgressId", void 0);
exports.UserInfoDTO = UserInfoDTO = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [user_model_1.default])
], UserInfoDTO);
//# sourceMappingURL=user-info.dto.js.map