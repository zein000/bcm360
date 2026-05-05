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
var FileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const Minio = require("minio");
const aws_config_1 = require("./aws.config/aws.config");
const FileTypes_enum_1 = require("./enum/FileTypes.enum");
const FileTypeToMimetype_1 = require("./contants/FileTypeToMimetype");
let FileService = FileService_1 = class FileService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(FileService_1.name);
        this.client = new Minio.Client({
            endPoint: config.endpoint || "127.0.0.1",
            port: config.port,
            accessKey: config.accessKey,
            secretKey: config.secretAccessKey,
            region: config.region,
            useSSL: false,
        });
        this.fullBucketPrefix = `http://${this.config.endpoint}/${this.config.bucketName}/`;
        this.fullBucketPrefixWithPort = `http://${this.config.endpoint}:${this.config.port}/${this.config.bucketName}/`;
    }
    async uploadTempFile(path, file) {
        try {
            await this.client.fPutObject(this.config.bucketName, file, path);
            return `${this.config.bucketName}/${file}`;
        }
        catch (e) {
            this.logger.error(e.message, e.stack);
        }
    }
    async uploadFiles(files, isReturnOnlyLinks = false) {
        try {
            const filePaths = [];
            for (const file of files) {
                const path = `${this.config.pathname}/public/${Date.now()}-${file.originalname}`;
                await this.client.putObject(this.config.bucketName, path, file.buffer);
                if (isReturnOnlyLinks) {
                    filePaths.push(this.fullBucketPrefix + path);
                }
                else {
                    let fileType = FileTypes_enum_1.FileTypes.Unknown;
                    if ((file === null || file === void 0 ? void 0 : file.mimetype) && FileTypeToMimetype_1.FileTypeToMimetype[file === null || file === void 0 ? void 0 : file.mimetype]) {
                        fileType = FileTypeToMimetype_1.FileTypeToMimetype[file.mimetype];
                    }
                    filePaths.push({
                        fileType,
                        fullFilePath: this.fullBucketPrefixWithPort + path,
                        fileName: file.originalname,
                        fileLength: file.size,
                    });
                }
            }
            return filePaths;
        }
        catch (e) {
            this.logger.error(e.message, e.stack);
            throw e;
        }
    }
    async deleteFile(path) {
        try {
            const objectLocalPath = path.replace(this.fullBucketPrefix, "");
            await this.client.removeObject(this.config.bucketName, objectLocalPath);
        }
        catch (e) {
            this.logger.error(`Error deleting file at ${path}: ${e.message}`, e.stack);
        }
    }
    async deleteFiles(paths) {
        try {
            const objectLocalPaths = paths.map((path) => path.replace(this.fullBucketPrefix, ""));
            return this.client.removeObjects(this.config.bucketName, objectLocalPaths);
        }
        catch (e) {
            this.logger.error(`Error deleting files at ${paths.join(", ")}: ${e.message}`, e.stack);
        }
    }
};
exports.FileService = FileService;
exports.FileService = FileService = FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(aws_config_1.default.KEY)),
    __metadata("design:paramtypes", [void 0])
], FileService);
//# sourceMappingURL=file.service.js.map