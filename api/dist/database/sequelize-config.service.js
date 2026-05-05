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
exports.SequelizeConfigService = void 0;
const common_1 = require("@nestjs/common");
const database_config_1 = require("./config/database.config");
let SequelizeConfigService = class SequelizeConfigService {
    constructor(config) {
        this.config = config;
    }
    createSequelizeOptions() {
        return {
            dialect: "mysql",
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            database: this.config.database,
            models: [`${__dirname}/../**/*.model{.ts,.js}`],
            synchronize: false,
            sync: { alter: false },
            autoLoadModels: false,
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        };
    }
};
exports.SequelizeConfigService = SequelizeConfigService;
exports.SequelizeConfigService = SequelizeConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_config_1.default.KEY)),
    __metadata("design:paramtypes", [void 0])
], SequelizeConfigService);
//# sourceMappingURL=sequelize-config.service.js.map