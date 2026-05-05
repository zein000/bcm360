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
var RetryProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const http_client_service_1 = require("../http-client/http-client.service");
const constants_1 = require("./constants");
let RetryProcessor = RetryProcessor_1 = class RetryProcessor extends bullmq_1.WorkerHost {
    constructor(httpClient) {
        super();
        this.httpClient = httpClient;
        this.logger = new common_1.Logger(RetryProcessor_1.name);
    }
    async process(job) {
        var _a;
        let name = job.name;
        if ((_a = job.name) === null || _a === void 0 ? void 0 : _a.includes("-")) {
            name = job.name.split("-")[0];
        }
        switch (name) {
            case constants_1.RETRY_QUEUE_JOBS_PREFIX:
                await this.handleRequest(job);
                break;
        }
    }
    async handleRequest(job) {
        const { url, data, options, method } = job.data;
        let result = null;
        try {
            switch (method) {
                case "post": {
                    result = await this.httpClient.post({ url, data, options });
                    break;
                }
            }
        }
        catch (error) {
            result = { success: false, error };
            this.logger.error(error.message, error.stack);
        }
        if (result.success === false) {
            throw result.error;
        }
    }
};
exports.RetryProcessor = RetryProcessor;
exports.RetryProcessor = RetryProcessor = RetryProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(constants_1.RETRY_QUEUE_NAME),
    __metadata("design:paramtypes", [http_client_service_1.HttpClientService])
], RetryProcessor);
//# sourceMappingURL=retry.processor.js.map