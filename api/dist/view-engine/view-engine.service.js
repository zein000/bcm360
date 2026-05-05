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
var ViewEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewEngineService = void 0;
const common_1 = require("@nestjs/common");
const handlebars_1 = require("handlebars");
const fs_1 = require("fs");
const path_1 = require("path");
const view_engine_config_1 = require("./config/view-engine.config");
let ViewEngineService = ViewEngineService_1 = class ViewEngineService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(ViewEngineService_1.name);
        this.templates = {};
        this.layouts = {};
        this.partials = {};
        for (const file of (0, fs_1.readdirSync)(config.partialsDir)) {
            const fileName = file.split(".")[0];
            const fileContents = (0, fs_1.readFileSync)((0, path_1.join)(config.partialsDir, file)).toString();
            this.partials[fileName] = handlebars_1.default.compile(fileContents);
            handlebars_1.default.registerPartial(fileName, this.partials[fileName]);
        }
        for (const file of (0, fs_1.readdirSync)(config.layoutsDir)) {
            const fileName = file.split(".")[0];
            const fileContents = (0, fs_1.readFileSync)((0, path_1.join)(config.layoutsDir, file)).toString();
            this.layouts[fileName] = handlebars_1.default.compile(fileContents);
        }
        for (const file of (0, fs_1.readdirSync)(config.viewsDir)) {
            const fileInfo = (0, fs_1.lstatSync)((0, path_1.join)(config.viewsDir, file));
            if (!fileInfo.isDirectory()) {
                const fileName = file.split(".")[0];
                const fileContents = (0, fs_1.readFileSync)((0, path_1.join)(config.viewsDir, file)).toString();
                this.templates[fileName] = handlebars_1.default.compile(fileContents);
            }
        }
    }
    render(templateName, options) {
        let layout = this.config.defaultLayout;
        if ((options === null || options === void 0 ? void 0 : options.layout) !== undefined) {
            layout = options.layout;
        }
        if (!this.templates[templateName]) {
            this.logger.error(`Template with name ${templateName} does not exist`);
            throw new common_1.InternalServerErrorException("VIEW_ENGINE_TEMPLATE_NOT_FOUND");
        }
        if (layout && !this.layouts[layout]) {
            this.logger.error(`Template layout with name ${layout} does not exist`);
            throw new common_1.InternalServerErrorException("VIEW_ENGINE_TEMPLATE_LAYOUT_NOT_FOUND");
        }
        try {
            const templateResult = this.templates[templateName](options === null || options === void 0 ? void 0 : options.data);
            return layout ? this.layouts[layout]({ body: templateResult }) : templateResult;
        }
        catch (error) {
            this.logger.error(error, `Failed to render template ${templateName} with data ${JSON.stringify(options === null || options === void 0 ? void 0 : options.data)}`);
            throw new common_1.InternalServerErrorException("VIEW_ENGINE_RENDER");
        }
    }
};
exports.ViewEngineService = ViewEngineService;
exports.ViewEngineService = ViewEngineService = ViewEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(view_engine_config_1.default.KEY)),
    __metadata("design:paramtypes", [void 0])
], ViewEngineService);
//# sourceMappingURL=view-engine.service.js.map