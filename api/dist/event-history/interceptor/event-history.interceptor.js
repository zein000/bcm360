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
exports.EventHistoryInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const event_name_enum_1 = require("../../enums/event-name.enum");
const event_history_service_1 = require("../event-history.service");
const EventHistoryInterceptor = (eventName) => {
    let EventHistoryInterceptor = class EventHistoryInterceptor {
        constructor(eventHistoryService) {
            this.eventHistoryService = eventHistoryService;
        }
        intercept(context, next) {
            var _a;
            const request = context.switchToHttp().getRequest();
            const data = {};
            const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
            switch (eventName) {
                case event_name_enum_1.EventName.REGISTRATION:
                    data.purpose = request.body.purpose;
                    break;
                default:
                    break;
            }
            return next.handle().pipe((0, rxjs_1.map)((res) => {
                var _a, _b;
                if (userId || ((_a = res === null || res === void 0 ? void 0 : res.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    this.eventHistoryService.saveHistory(eventName, userId || ((_b = res === null || res === void 0 ? void 0 : res.user) === null || _b === void 0 ? void 0 : _b.id), data);
                }
                return res;
            }));
        }
    };
    EventHistoryInterceptor = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => event_history_service_1.EventHistoryService))),
        __metadata("design:paramtypes", [event_history_service_1.EventHistoryService])
    ], EventHistoryInterceptor);
    return (0, common_1.mixin)(EventHistoryInterceptor);
};
exports.EventHistoryInterceptor = EventHistoryInterceptor;
//# sourceMappingURL=event-history.interceptor.js.map