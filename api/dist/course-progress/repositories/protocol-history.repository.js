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
var ProtocolHistoryRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const protocol_histories_model_1 = require("../models/protocol-histories.model");
const errors_enum_1 = require("../../enums/errors.enum");
let ProtocolHistoryRepository = ProtocolHistoryRepository_1 = class ProtocolHistoryRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(ProtocolHistoryRepository_1.name);
    }
    async create(protocolHistory) {
        try {
            return this.model.create(protocolHistory);
        }
        catch (error) {
            this.logger.error(error, "Failed to create protocol history");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.ProtocolHistoryRepository = ProtocolHistoryRepository;
exports.ProtocolHistoryRepository = ProtocolHistoryRepository = ProtocolHistoryRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(protocol_histories_model_1.default)),
    __metadata("design:paramtypes", [Object])
], ProtocolHistoryRepository);
//# sourceMappingURL=protocol-history.repository.js.map