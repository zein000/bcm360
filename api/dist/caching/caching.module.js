"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const caching_config_1 = require("./config/caching.config");
const caching_config_schema_1 = require("./config/caching.config.schema");
const users_module_1 = require("../users/users.module");
const caching_config_service_1 = require("./caching-config.service");
const clear_user_info_interceptor_1 = require("./interceptors/clear-user-info.interceptor");
const blacklist_caching_service_1 = require("./services/blacklist-caching.service");
const user_info_caching_service_1 = require("./services/user-info-caching.service");
const scenario_progress_caching_service_1 = require("./services/scenario-progress-caching.service");
const info_for_quest_caching_service_1 = require("./services/info-for-quest-caching.service");
let CachingModule = class CachingModule {
};
exports.CachingModule = CachingModule;
exports.CachingModule = CachingModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [caching_config_1.default],
                validationSchema: caching_config_schema_1.CACHE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA,
            }),
            cache_manager_1.CacheModule.registerAsync({
                imports: [
                    config_1.ConfigModule.forRoot({
                        load: [caching_config_1.default],
                    }),
                ],
                useClass: caching_config_service_1.CachingConfigService,
            }),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [],
        providers: [
            user_info_caching_service_1.UserInfoCachingService,
            info_for_quest_caching_service_1.InfoForQuestCachingService,
            clear_user_info_interceptor_1.ClearUserInfoCacheInterceptor,
            blacklist_caching_service_1.BlacklistJwtCachingService,
            scenario_progress_caching_service_1.ScenarioProgressCachingService,
        ],
        exports: [
            user_info_caching_service_1.UserInfoCachingService,
            info_for_quest_caching_service_1.InfoForQuestCachingService,
            clear_user_info_interceptor_1.ClearUserInfoCacheInterceptor,
            blacklist_caching_service_1.BlacklistJwtCachingService,
            scenario_progress_caching_service_1.ScenarioProgressCachingService,
        ],
    })
], CachingModule);
//# sourceMappingURL=caching.module.js.map