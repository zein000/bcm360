"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const http_client_module_1 = require("../http-client/http-client.module");
const retry_config_1 = require("./config/retry.config");
const retry_config_schema_1 = require("./config/retry.config.schema");
const constants_1 = require("./constants");
const retry_processor_1 = require("./retry.processor");
const config = (0, retry_config_1.default)();
const RetryQueue = bullmq_1.BullModule.registerQueue({
    name: constants_1.RETRY_QUEUE_NAME,
    settings: {},
    defaultJobOptions: {
        removeOnComplete: true,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
    },
});
let RetryModule = class RetryModule {
};
exports.RetryModule = RetryModule;
exports.RetryModule = RetryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [retry_config_1.default],
                validationSchema: retry_config_schema_1.RETRY_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA,
            }),
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: (config === null || config === void 0 ? void 0 : config.host) || process.env.REDIS_HOST,
                    port: config.port || +process.env.REDIS_PORT,
                    password: config.password || process.env.REDIS_PASSWORD,
                },
            }),
            RetryQueue,
            (0, common_1.forwardRef)(() => http_client_module_1.HttpClientModule),
        ],
        exports: [RetryQueue],
        providers: [retry_processor_1.RetryProcessor],
    })
], RetryModule);
//# sourceMappingURL=retry.module.js.map