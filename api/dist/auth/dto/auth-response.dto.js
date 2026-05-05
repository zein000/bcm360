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
exports.AuthResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_info_dto_1 = require("../../users/dto/user-info.dto");
const base_auth_response_dto_1 = require("./base-auth-response.dto");
let AuthResponseDTO = class AuthResponseDTO extends base_auth_response_dto_1.BaseAuthResponseDTO {
    constructor(data) {
        super();
        Object.assign(this, data);
    }
};
exports.AuthResponseDTO = AuthResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "JWT token generated for the specific user. Used for authorization to the server.",
    }),
    __metadata("design:type", String)
], AuthResponseDTO.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "JWT refresh token used for generating new access token.",
    }),
    __metadata("design:type", String)
], AuthResponseDTO.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Need to remember me" }),
    __metadata("design:type", Boolean)
], AuthResponseDTO.prototype, "isRememberMe", void 0);
exports.AuthResponseDTO = AuthResponseDTO = __decorate([
    (0, swagger_1.ApiExtraModels)(user_info_dto_1.UserInfoDTO),
    __metadata("design:paramtypes", [AuthResponseDTO])
], AuthResponseDTO);
//# sourceMappingURL=auth-response.dto.js.map