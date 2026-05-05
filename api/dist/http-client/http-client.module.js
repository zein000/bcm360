"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const retry_module_1 = require("../retry/retry.module");
const configuration_module_1 = require("../configuration/configuration.module");
const http_client_service_1 = require("./http-client.service");
let HttpClientModule = class HttpClientModule {
};
exports.HttpClientModule = HttpClientModule;
exports.HttpClientModule = HttpClientModule = __decorate([
    (0, common_1.Module)({
        imports: [
            configuration_module_1.ConfigurationModule,
            axios_1.HttpModule.register({
                timeout: 180000,
                maxRedirects: 5,
            }),
            (0, common_1.forwardRef)(() => retry_module_1.RetryModule),
        ],
        providers: [http_client_service_1.HttpClientService],
        exports: [http_client_service_1.HttpClientService],
    })
], HttpClientModule);
//# sourceMappingURL=http-client.module.js.map