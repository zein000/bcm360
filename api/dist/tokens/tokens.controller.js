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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const base_response_dto_1 = require("../common/dto/base-response.dto");
const swagger_configs_1 = require("../common/swagger-configs");
const validate_token_request_dto_1 = require("./dto/validate-token-request.dto");
const validate_token_response_dto_1 = require("./dto/validate-token-response.dto");
const tokens_service_1 = require("./tokens.service");
let TokensController = class TokensController {
    constructor(tokensService) {
        this.tokensService = tokensService;
    }
    async validate(data) {
        return this.tokensService.validateToken(data.token);
    }
    async resend(data) {
        return this.tokensService.resend(data.token);
    }
};
exports.TokensController = TokensController;
__decorate([
    (0, common_1.Get)("validate"),
    (0, swagger_1.ApiOperation)({
        summary: "Validate invitation token",
        description: "Endpoint to validate invitation token status.",
    }),
    (0, swagger_1.ApiOkResponse)({
        type: validate_token_response_dto_1.ValidateTokenResponseDTO,
        description: "Returns token status. If token is expired returns email too.",
    }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_token_request_dto_1.ValidateTokenRequestDTO]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)("resend"),
    (0, swagger_1.ApiOperation)({
        summary: "Resend invitation",
        description: "Endpoint to resend invitation by token.",
    }),
    (0, swagger_1.ApiOkResponse)({ type: (base_response_dto_1.BaseResponseDTO) }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_token_request_dto_1.ValidateTokenRequestDTO]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "resend", null);
exports.TokensController = TokensController = __decorate([
    (0, swagger_1.ApiTags)("Token"),
    (0, swagger_1.ApiInternalServerErrorResponse)(swagger_configs_1.internalServerErrorConfig),
    (0, common_1.Controller)("token"),
    __metadata("design:paramtypes", [tokens_service_1.TokensService])
], TokensController);
//# sourceMappingURL=tokens.controller.js.map