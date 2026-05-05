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
exports.ConfirmEmailDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const token_purpose_enum_1 = require("../../tokens/enums/token-purpose.enum");
class ConfirmEmailDTO {
}
exports.ConfirmEmailDTO = ConfirmEmailDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The token generated that authenticates the user to set his password.",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfirmEmailDTO.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The purpose for using set password functionality(Token purpose).",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(token_purpose_enum_1.ETokenPurpose),
    __metadata("design:type", String)
], ConfirmEmailDTO.prototype, "purpose", void 0);
//# sourceMappingURL=confirm-email.dto.js.map