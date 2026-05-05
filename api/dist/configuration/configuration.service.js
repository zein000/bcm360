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
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const configuration_repository_1 = require("./repositories/configuration.repository");
let ConfigurationService = class ConfigurationService {
    constructor(configRepo) {
        this.configRepo = configRepo;
    }
    async findAll() {
        return (await this.configRepo.findAll()).map(this.toResponse);
    }
    async findAllByNameInteranal(name) {
        return await this.configRepo.findAllByName(name);
    }
    async findAllByName(name) {
        const configs = await this.configRepo.findAllByName(name);
        return configs.map((config) => this.toResponse(config));
    }
    async findOneByName(name) {
        return this.configRepo.findByName(name);
    }
    async find(name, companyId) {
        return this.toResponse(await this.configRepo.findByName(name, companyId));
    }
    async create(user, name, value) {
        return this.toResponse(await this.configRepo.save(this.configRepo.create({ name, value, updatedBy: user.id })));
    }
    async update(user, name, value) {
        const config = await this.configRepo.findByName(name, user.companyId);
        return this.toResponse(await this.configRepo.update(config, { value, updatedBy: user.id }));
    }
    async upsert(user, name, value) {
        return this.toResponse((await this.configRepo.upsert({ name, value, updatedBy: user.id }))[0]);
    }
    async delete(user, name) {
        await this.configRepo.deleteByName(user.id, name);
    }
    toResponse(config) {
        const data = config.dataValues ? config.toJSON() : config;
        return {
            name: data.name,
            value: data.value,
            companyId: data.companyId,
        };
    }
};
exports.ConfigurationService = ConfigurationService;
exports.ConfigurationService = ConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [configuration_repository_1.ConfigurationRepository])
], ConfigurationService);
//# sourceMappingURL=configuration.service.js.map