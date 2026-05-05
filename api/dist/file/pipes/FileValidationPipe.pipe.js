"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let FileValidationPipe = class FileValidationPipe {
    transform(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException("No files provided.");
        }
        files.forEach((file) => {
            const maxSizeInBytes = 20 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                throw new common_1.BadRequestException(`File ${file.originalname} exceeds the size limit of 20MB.`);
            }
            const allowedMimeTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/svg+xml",
                "application/pdf",
                "video/mp4",
                "video/avi",
                "video/mkv",
                "audio/wav",
                "audio/mpeg",
            ];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException(`File ${file.originalname} has an invalid type: ${file.mimetype}.`);
            }
        });
        return files;
    }
};
exports.FileValidationPipe = FileValidationPipe;
exports.FileValidationPipe = FileValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileValidationPipe);
//# sourceMappingURL=FileValidationPipe.pipe.js.map