"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("aws", () => ({
    endpoint: process.env.MINIO_ENDPOINT,
    bucketName: process.env.MINIO_BUCKET,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
    region: process.env.AWS_REGION,
    pathname: process.env.AWS_PATHNAME,
    port: Number(process.env.MINIO_PORT)
}));
//# sourceMappingURL=aws.config.js.map