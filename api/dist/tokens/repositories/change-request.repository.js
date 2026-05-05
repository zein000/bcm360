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
var ChangeRequestRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeRequestRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const errors_enum_1 = require("../../enums/errors.enum");
const change_request_model_1 = require("../models/change-request.model");
let ChangeRequestRepository = ChangeRequestRepository_1 = class ChangeRequestRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(ChangeRequestRepository_1.name);
    }
    async createChangeRequest(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            this.logger.error(error, "Failed to create change request");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async markAsAccepted(id) {
        try {
            return await this.model.update({ isAccepted: true }, { where: { id } });
        }
        catch (error) {
            this.logger.error(error, "Failed to mark change request as accepted");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.ChangeRequestRepository = ChangeRequestRepository;
exports.ChangeRequestRepository = ChangeRequestRepository = ChangeRequestRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(change_request_model_1.default)),
    __metadata("design:paramtypes", [Object])
], ChangeRequestRepository);
//# sourceMappingURL=change-request.repository.js.map