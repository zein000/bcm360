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
exports.PageDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const page_meta_dto_1 = require("./page-meta.dto");
let PageDTO = class PageDTO {
    constructor(data, meta) {
        this.data = data;
        this.meta = meta;
    }
};
exports.PageDTO = PageDTO;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)({ isArray: true, description: "Array of data" }),
    __metadata("design:type", Array)
], PageDTO.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => page_meta_dto_1.PageMetaDTO, description: "Pagination info" }),
    __metadata("design:type", page_meta_dto_1.PageMetaDTO)
], PageDTO.prototype, "meta", void 0);
exports.PageDTO = PageDTO = __decorate([
    (0, swagger_1.ApiExtraModels)(page_meta_dto_1.PageMetaDTO),
    __metadata("design:paramtypes", [Array, page_meta_dto_1.PageMetaDTO])
], PageDTO);
//# sourceMappingURL=page.dto.js.map