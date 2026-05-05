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
var ConnectQuestController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectQuestController = void 0;
const common_1 = require("@nestjs/common");
const connect_quest_service_1 = require("./connect-quest.service");
const swagger_1 = require("@nestjs/swagger");
let ConnectQuestController = ConnectQuestController_1 = class ConnectQuestController {
    constructor(connectQuestService) {
        this.connectQuestService = connectQuestService;
        this.logger = new common_1.Logger(ConnectQuestController_1.name);
    }
    async getPin() {
        return await this.connectQuestService.getPin();
    }
    async getPerPin(pin) {
        const parsedPin = parseInt(pin, 10);
        return await this.connectQuestService.getPerPin(parsedPin);
    }
};
exports.ConnectQuestController = ConnectQuestController;
__decorate([
    (0, common_1.Get)("pin"),
    (0, swagger_1.ApiOperation)({
        summary: "Liefert den aktuellen PIN",
        description: "Gibt die aktuell gespeicherte PIN zurück, die zur Verbindung mit einer Quest genutzt werden kann.",
    }),
    (0, swagger_1.ApiOkResponse)({
        type: String,
        description: "Die aktuell gültige PIN.",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConnectQuestController.prototype, "getPin", null);
__decorate([
    (0, common_1.Get)("pin/:pin"),
    (0, swagger_1.ApiOperation)({
        summary: "Suche nach PIN",
        description: "Findet und gibt den JWT, die CourseProgressID und die ID des aufrufenden Users zur übergebenen PIN zurück, falls vorhanden.",
    }),
    (0, swagger_1.ApiOkResponse)({
        type: String,
        description: "Daten zur PIN: den JWT, die CourseProgressID und die ID des aufrufenden Users.",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "PIN wurde nicht gefunden oder ist ungültig.",
    }),
    __param(0, (0, common_1.Param)("pin")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConnectQuestController.prototype, "getPerPin", null);
exports.ConnectQuestController = ConnectQuestController = ConnectQuestController_1 = __decorate([
    (0, swagger_1.ApiTags)("Connect Quest"),
    (0, common_1.Controller)("connect-quest"),
    __metadata("design:paramtypes", [connect_quest_service_1.ConnectQuestService])
], ConnectQuestController);
//# sourceMappingURL=connect-quest.controller.js.map