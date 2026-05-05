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
exports.HttpClientService = void 0;
const axios_1 = require("@nestjs/axios");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const rxjs_1 = require("rxjs");
const class_validator_1 = require("class-validator");
const https_proxy_agent_1 = require("https-proxy-agent");
const socks_proxy_agent_1 = require("socks-proxy-agent");
const constants_1 = require("../retry/constants");
const application_enum_1 = require("../enums/application.enum");
const configuration_service_1 = require("../configuration/configuration.service");
const proxyChain = require("proxy-chain");
let HttpClientService = class HttpClientService {
    constructor(httpService, retryQueue, configurationService) {
        this.httpService = httpService;
        this.retryQueue = retryQueue;
        this.configurationService = configurationService;
        this.logger = new common_1.Logger();
        this.validator = new class_validator_1.Validator();
        this.proxyUrl = "http://6e7478f829017d8c7564__cr.de:d74809818fd99871@gw.dataimpulse.com:823";
        this.logging = false;
        if (process.env.NODE_ENV !== "test") {
            proxyChain.anonymizeProxy({ url: this.proxyUrl }).then((r) => {
                this.proxyChain = r;
            });
        }
    }
    async parseErrorForRetry(error, requestProperties, retryJobOptions) {
        try {
            if ("response" in error) {
                const castedError = error;
                if ([
                    common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    common_1.HttpStatus.REQUEST_TIMEOUT,
                    common_1.HttpStatus.GATEWAY_TIMEOUT,
                ].includes(castedError.response.status)) {
                    await this.retryQueue.add(constants_1.RETRY_QUEUE_JOBS_PREFIX, requestProperties, retryJobOptions);
                }
            }
            else {
                await this.retryQueue.add(constants_1.RETRY_QUEUE_JOBS_PREFIX, requestProperties, retryJobOptions);
            }
        }
        catch (queueError) {
            this.logger.error("Push to retry queue failed with error: ", queueError);
        }
    }
    async proxiedRequest(proxyURL, endpoint) {
        const tunnelTimeout = 10000;
        const parsedUrl = new URL(proxyURL);
        let agent;
        if (parsedUrl.protocol.startsWith("http")) {
            agent = new https_proxy_agent_1.HttpsProxyAgent(proxyURL);
        }
        else if (parsedUrl.protocol.startsWith("socks")) {
            agent = new socks_proxy_agent_1.SocksProxyAgent(proxyURL);
        }
        else {
            throw new Error(`Unsupported proxy scheme: ${parsedUrl.protocol}`);
        }
        try {
            const response = await this.httpService
                .get(endpoint, {
                httpAgent: agent,
                httpsAgent: agent,
                timeout: tunnelTimeout,
                headers: { "User-Agent": "Guest" },
            })
                .toPromise();
            return response.data;
        }
        catch (error) {
            throw new Error(error.response.status);
        }
    }
    async calcucateCosts(url, application) {
        let app;
        let factor = 1;
        if (application === application_enum_1.ApiApplications.CLEAROUT && url.includes("clearout.io/v2/email_verify")) {
            app = "CLEAROUT_COSTS";
        }
        else if (application === application_enum_1.ApiApplications.CLEAROUT &&
            url.includes("clearout.io/v2/email_finder")) {
            app = "CLEAROUT_COSTS";
            factor = 4;
        }
        else if (application === application_enum_1.ApiApplications.SERPER) {
            app = "SERPER_COSTS";
        }
        else if (application === application_enum_1.ApiApplications.ZENROWS) {
            app = "ZENROWS_COSTS";
        }
        else if (application === application_enum_1.ApiApplications.ZERBOUNCE &&
            url.includes("zerobounce.net/v2/validate")) {
            app = "ZERBOUNCE_VALIDATE_COSTS";
        }
        else if (application === application_enum_1.ApiApplications.ZERBOUNCE &&
            url.includes("zerobounce.net/v2/guessformat")) {
            app = "ZERBOUNCE_FINDER_COSTS";
        }
        else if (application === application_enum_1.ApiApplications.JSEARCH) {
            app = "JSEARCH";
        }
        else if (application === application_enum_1.ApiApplications.GENDERIZE) {
            app = "GENDERIZE_COSTS";
        }
        else if (application === application_enum_1.ApiApplications.RAPIDAPI_LINKEDIN_DATA_SCRAPER) {
            app = "RAPIDAPI_LINKEDIN_DATA_SCRAPER";
        }
        else if (application === application_enum_1.ApiApplications.RAPIDAPI_LOCAL_BUSINESS_DATA) {
            app = "RAPIDAPI_LOCAL_BUSINESS_DATA";
        }
        else if (application === application_enum_1.ApiApplications.TAVILY) {
            app = "TAVILY";
        }
        else if (application === application_enum_1.ApiApplications.RAPIDAPI_RT_LINKEDIN_DATA_SCRAPER_API) {
            app = "RAPIDAPI_RT_LINKEDIN_DATA_SCRAPER_API";
        }
        else if (application === application_enum_1.ApiApplications.RAPIDAPI_FRESH_LINKEDIN_PROFILE_DATA) {
            app = "RAPIDAPI_FRESH_LINKEDIN_PROFILE_DATA";
        }
        if (app) {
            const config = await this.configurationService.findOneByName(app);
            return +config.value * factor;
        }
        return 0;
    }
    async getCached({ url, headers, params, companyId, listId, application, proxied, ignoreCache, retryMechanism, config, model, referenceId, }) {
        var _a, _b, _c, _d, _e, _f;
        this.logging && this.logger.log({ params }, `GET Request ${url}`);
        const start = Date.now();
        try {
            const obs = this.httpService
                .get(url, Object.assign({ httpAgent: proxied ? new https_proxy_agent_1.HttpsProxyAgent(this.proxyUrl) : undefined, headers,
                params, timeout: 30000 }, config))
                .pipe((0, rxjs_1.map)((resp) => resp.data), (0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err)));
            const res = await (0, rxjs_1.lastValueFrom)(obs);
            this.logging &&
                this.logger.log({ timeElapsed: start - Date.now(), cached: false }, `GET Response ${url}`);
            try {
                if (url.includes("linkedin-bulk-data-scraper.p.rapidapi.com") &&
                    ((_a = res === null || res === void 0 ? void 0 : res.message) === null || _a === void 0 ? void 0 : _a.includes("No free account spotted. Please inform developer team."))) {
                    this.logger.log(`429 - RATELIMIT for url: ${url} - Retrying in ${5 * 60} seconds`);
                    await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
                    return this.getCached({
                        url,
                        headers,
                        params,
                        companyId,
                        listId,
                        application,
                        proxied,
                        ignoreCache,
                        retryMechanism,
                        model,
                        referenceId,
                    });
                }
                if (url.includes("linkedin-data-api.p.rapidapi.com") &&
                    ((_b = res === null || res === void 0 ? void 0 : res.message) === null || _b === void 0 ? void 0 : _b.includes("The request was blocked by LinkedIn due to too many requests"))) {
                    this.logger.log(`429 - RATELIMIT for url: ${url} - Retrying in ${15} seconds`);
                    await new Promise((resolve) => setTimeout(resolve, 15 * 1000));
                    return this.getCached({
                        url,
                        headers,
                        params,
                        companyId,
                        listId,
                        application,
                        proxied,
                        ignoreCache,
                        retryMechanism,
                        model,
                        referenceId,
                    });
                }
                return {
                    success: true,
                    data: res.data,
                };
            }
            catch (e) {
                this.logger.error(e.message, e.stack, "ERROR");
            }
        }
        catch (error) {
            let retryAfter = ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.headers["retry-after"])
                ? +error.response.headers["retry-after"]
                : 15;
            if (retryMechanism && ((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 429) {
                if (((_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.status) === 500 &&
                    url.includes("https://linkedin-bulk-data-scraper.p.rapidapi.com")) {
                    return {
                        success: false,
                        error,
                    };
                }
                if (url.includes("https://linkedin-bulk-data-scraper.p.rapidapi.com")) {
                    retryAfter = 1;
                }
                this.logger.log(`429 - RATELIMIT for url: ${url} - Retrying in ${retryAfter} seconds`);
                await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
                return this.getCached({
                    url,
                    headers,
                    params,
                    companyId,
                    listId,
                    application,
                    proxied,
                    ignoreCache,
                    retryMechanism,
                    model,
                    referenceId,
                });
            }
            this.logger.warn({ message: error.message, url }, `GET Error Response`);
            return {
                success: false,
                error,
            };
        }
    }
    async get(url, headers, params) {
        const start = Date.now();
        try {
            const res = await this.httpService
                .get(url, {
                headers,
                params,
            })
                .toPromise();
            this.logging && this.logger.log({ timeElapsed: start - Date.now() }, `GET Response ${url}`);
            return {
                success: true,
                data: res.data,
            };
        }
        catch (error) {
            this.logger.warn({
                response: error.message,
                timeElapsed: start - Date.now(),
            }, `GET Error Response ${url}`);
            return {
                success: false,
                error,
            };
        }
    }
    async postCached({ url, data, options, retryMechanism, timeout, companyId, listId, application, model, referenceId, ignoreCache, }) {
        var _a, _b, _c;
        const start = Date.now();
        const requestProperties = {
            method: "post",
            url,
            data,
            options,
        };
        try {
            const obs = this.httpService
                .post(url, data, Object.assign(Object.assign({}, requestProperties.options), { timeout: timeout !== null && timeout !== void 0 ? timeout : 180000 }))
                .pipe((0, rxjs_1.map)((resp) => resp.data), (0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err)));
            const res = await (0, rxjs_1.lastValueFrom)(obs);
            this.logging &&
                this.logger.log({ timeElapsed: start - Date.now(), cached: false }, `POST Response ${url}`);
            return {
                success: true,
                data: res.data,
            };
        }
        catch (error) {
            if (retryMechanism &&
                ((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) === "No free account spotted. Please inform developer team.") {
                const retryAfter = ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.headers["retry-after"])
                    ? +error.response.headers["retry-after"]
                    : 5 * 60;
                this.logging &&
                    this.logger.log(`429 - RATELIMIT for url: ${url}`, `Retrying in ${retryAfter} seconds`);
                await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
                return this.postCached({
                    url,
                    data,
                    options,
                    retryMechanism: false,
                    companyId,
                    listId,
                    application,
                    model,
                    referenceId,
                });
            }
        }
    }
    async delete({ url, options, }) {
        const { headers, params, auth } = options !== null && options !== void 0 ? options : {};
        this.logging && this.logger.log({ headers, params }, `DELETE Request ${url}`);
        const start = Date.now();
        try {
            const res = await this.httpService
                .delete(url, {
                headers,
                params,
                auth,
            })
                .toPromise();
            this.logging &&
                this.logger.log({ response: res, timeElapsed: start - Date.now() }, `DELETE Response ${url}`);
            return {
                success: true,
                data: res.data,
            };
        }
        catch (error) {
            this.logger.warn({
                response: error,
                timeElapsed: start - Date.now(),
            }, `DELETE Error Response ${url}`);
            return {
                success: false,
                error,
            };
        }
    }
    async post({ url, data, options, retryJobOptions, retryMechanism = false, }) {
        const { headers, params } = options !== null && options !== void 0 ? options : {};
        this.logging && this.logger.log({ request: data, headers, params }, `POST Request ${url}`);
        const start = Date.now();
        const requestProperties = {
            method: "post",
            url,
            data,
            options,
        };
        try {
            const res = await this.httpService
                .post(url, data, requestProperties.options)
                .toPromise();
            this.logging &&
                this.logger.log({ response: res, timeElapsed: start - Date.now() }, `POST Response ${url}`);
            return {
                success: true,
                data: res.data,
            };
        }
        catch (error) {
            if (retryMechanism) {
                await this.parseErrorForRetry(error, requestProperties, retryJobOptions);
            }
            this.logger.warn({
                response: error.message,
                timeElapsed: start - Date.now(),
            }, `POST Error Response ${url}`);
            return {
                success: false,
                error,
            };
        }
    }
    async isValid(url, user) {
        const errors = await this.validator.validate(user);
        if (errors.length) {
            const error = `Validation error ${errors.join(";")}`;
            this.logger.error({ error }, `Received invalid response from ${url}`);
            throw new Error(error);
        }
    }
    buildBasicAuth(username, password) {
        return "Basic " + Buffer.from(username + ":" + password || "").toString("base64");
    }
};
exports.HttpClientService = HttpClientService;
exports.HttpClientService = HttpClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(constants_1.RETRY_QUEUE_NAME)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        bullmq_2.Queue,
        configuration_service_1.ConfigurationService])
], HttpClientService);
//# sourceMappingURL=http-client.service.js.map