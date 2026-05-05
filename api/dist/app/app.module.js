"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const nestjs_pino_1 = require("nestjs-pino");
const cache_manager_1 = require("@nestjs/cache-manager");
const _2fa_module_1 = require("../2fa/2fa.module");
const auth_module_1 = require("../auth/auth.module");
const database_module_1 = require("../database/database.module");
const mail_module_1 = require("../mail/mail.module");
const permissions_module_1 = require("../permissions/permissions.module");
const roles_module_1 = require("../roles/roles.module");
const users_module_1 = require("../users/users.module");
const caching_module_1 = require("../caching/caching.module");
const request_id_middleware_1 = require("../common/middlewares/request-id.middleware");
const configuration_module_1 = require("../configuration/configuration.module");
const constants_1 = require("../constants");
const event_history_module_1 = require("../event-history/event-history.module");
const health_module_1 = require("../health/health.module");
const seeder_module_1 = require("../seeder/seeder.module");
const view_engine_module_1 = require("../view-engine/view-engine.module");
const app_config_1 = require("./config/app.config");
const company_module_1 = require("../company/company.module");
const course_progress_module_1 = require("../course-progress/course-progress.module");
const course_module_1 = require("../courses/course.module");
const features_module_1 = require("../features/features.module");
const file_module_1 = require("../file/file.module");
const retry_module_1 = require("../retry/retry.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_id_middleware_1.RequestIdMiddleware).forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                cache: false,
                envFilePath: ".env",
            }),
            cache_manager_1.CacheModule.register(),
            schedule_1.ScheduleModule.forRoot(),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: (0, app_config_1.default)().logLevel,
                    genReqId: (request) => request.headers[constants_1.REQUEST_ID_HEADER],
                    redact: ["req.headers.authorization", "req.body.password", "req.body.confirmPassword"],
                    serializers: {
                        req(req) {
                            req.body = req.raw.body;
                            delete req.body;
                            delete req.headers;
                            return req;
                        },
                        res(res) {
                            delete res.headers;
                            return res;
                        },
                    },
                    transport: (0, app_config_1.default)().logToken
                        ? {
                            target: "@logtail/pino",
                            options: {
                                sourceToken: (0, app_config_1.default)().logToken,
                            },
                        }
                        : {
                            target: "pino-pretty",
                            options: {
                                colorize: true,
                            },
                        },
                },
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: (0, app_config_1.default)().throttleTtl,
                    limit: (0, app_config_1.default)().throttleLimit,
                },
            ]),
            health_module_1.HealthModule,
            view_engine_module_1.ViewEngineModule,
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            _2fa_module_1.TwoFactorAuthenticationModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            course_progress_module_1.CourseProgressModule,
            configuration_module_1.ConfigurationModule,
            retry_module_1.RetryModule,
            seeder_module_1.SeederModule,
            event_history_module_1.EventHistoryModule,
            caching_module_1.CachingModule,
            company_module_1.CompanyModule,
            course_module_1.CourseModule,
            features_module_1.FeaturesModule,
            file_module_1.FileModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map