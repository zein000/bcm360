"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = downloadFile;
const axios_1 = require("axios");
const fs = require("fs");
async function downloadFile(fileUrl, outputLocationPath) {
    const stream = await (0, axios_1.default)({
        method: "get",
        url: fileUrl,
        responseType: "stream",
    });
    return await fs.promises.writeFile(outputLocationPath, stream.data);
}
//# sourceMappingURL=file.utils.js.map