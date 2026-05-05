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
var EventHistoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHistoryService = void 0;
const common_1 = require("@nestjs/common");
const event_history_repository_1 = require("./repositories/event-history.repository");
let EventHistoryService = EventHistoryService_1 = class EventHistoryService {
    constructor(eventHistoryRepo) {
        this.eventHistoryRepo = eventHistoryRepo;
        this.logger = new common_1.Logger(EventHistoryService_1.name);
    }
    async saveHistory(name, userId, data) {
        try {
            await this.eventHistoryRepo.create({
                name,
                userId,
                data,
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to save event history with name %s", name);
        }
    }
};
exports.EventHistoryService = EventHistoryService;
exports.EventHistoryService = EventHistoryService = EventHistoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_history_repository_1.EventHistoryRepository])
], EventHistoryService);
//# sourceMappingURL=event-history.service.js.map