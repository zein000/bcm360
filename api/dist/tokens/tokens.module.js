"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const token_config_schema_1 = require("./config/token.config.schema");
const token_config_1 = require("./config/token.config");
const users_module_1 = require("../users/users.module");
const change_request_model_1 = require("./models/change-request.model");
const token_model_1 = require("./models/token.model");
const change_request_repository_1 = require("./repositories/change-request.repository");
const token_repository_1 = require("./repositories/token.repository");
const tokens_controller_1 = require("./tokens.controller");
const tokens_service_1 = require("./tokens.service");
let TokensModule = class TokensModule {
};
exports.TokensModule = TokensModule;
exports.TokensModule = TokensModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([token_model_1.default, change_request_model_1.default]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            config_1.ConfigModule.forRoot({
                load: [token_config_1.default],
                validationSchema: token_config_schema_1.TOKEN_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA,
            }),
        ],
        controllers: [tokens_controller_1.TokensController],
        providers: [tokens_service_1.TokensService, token_repository_1.TokenRepository, change_request_repository_1.ChangeRequestRepository],
        exports: [tokens_service_1.TokensService],
    })
], TokensModule);
//# sourceMappingURL=tokens.module.js.map