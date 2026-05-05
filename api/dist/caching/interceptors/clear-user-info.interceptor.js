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
exports.ClearUserInfoCacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const user_info_dto_1 = require("../../users/dto/user-info.dto");
const user_model_1 = require("../../users/models/user.model");
const user_info_caching_service_1 = require("../services/user-info-caching.service");
let ClearUserInfoCacheInterceptor = class ClearUserInfoCacheInterceptor {
    constructor(userInfoCaching) {
        this.userInfoCaching = userInfoCaching;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data instanceof user_model_1.default || data instanceof user_info_dto_1.UserInfoDTO) {
                this.userInfoCaching.clearUser(data);
            }
            return data;
        }));
    }
};
exports.ClearUserInfoCacheInterceptor = ClearUserInfoCacheInterceptor;
exports.ClearUserInfoCacheInterceptor = ClearUserInfoCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_info_caching_service_1.UserInfoCachingService])
], ClearUserInfoCacheInterceptor);
//# sourceMappingURL=clear-user-info.interceptor.js.map