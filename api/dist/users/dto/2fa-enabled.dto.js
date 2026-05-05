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
exports.TwoFAEnabledDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_auth_response_dto_1 = require("../../auth/dto/base-auth-response.dto");
class TwoFAEnabledDTO extends base_auth_response_dto_1.BaseAuthResponseDTO {
    constructor(data) {
        super();
        Object.assign(this, data);
    }
}
exports.TwoFAEnabledDTO = TwoFAEnabledDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "JTW token for auth with OTP." }),
    __metadata("design:type", String)
], TwoFAEnabledDTO.prototype, "otpToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Need to remember me" }),
    __metadata("design:type", Boolean)
], TwoFAEnabledDTO.prototype, "isRememberMe", void 0);
//# sourceMappingURL=2fa-enabled.dto.js.map