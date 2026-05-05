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
var ProtocolDecisionRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolDecisionRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const protocol_decisions_model_1 = require("../models/protocol-decisions.model");
const errors_enum_1 = require("../../enums/errors.enum");
let ProtocolDecisionRepository = ProtocolDecisionRepository_1 = class ProtocolDecisionRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(ProtocolDecisionRepository_1.name);
    }
    async create(protocolDecision, votedBy) {
        try {
            const model = await this.model.create(protocolDecision);
            await model.$set("votedBy", votedBy);
            return model;
        }
        catch (error) {
            this.logger.error(error, "Failed to create protocol decision");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.ProtocolDecisionRepository = ProtocolDecisionRepository;
exports.ProtocolDecisionRepository = ProtocolDecisionRepository = ProtocolDecisionRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(protocol_decisions_model_1.default)),
    __metadata("design:paramtypes", [Object])
], ProtocolDecisionRepository);
//# sourceMappingURL=protocol-decisions.repository.js.map