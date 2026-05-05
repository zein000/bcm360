"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJwtPayload = void 0;
const extractJwtPayload = (jwt) => {
    const base64Payload = jwt.split(".")[1];
    const payloadBuffer = Buffer.from(base64Payload, "base64");
    return JSON.parse(payloadBuffer.toString());
};
exports.extractJwtPayload = extractJwtPayload;
//# sourceMappingURL=jwt.util.js.map