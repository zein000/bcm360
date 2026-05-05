"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDomains = void 0;
const normalizeDomains = (url) => {
    try {
        if (!url) {
            return null;
        }
        const nUrl = new URL(url.includes("http") ? url : `http://${url}`);
        return nUrl.hostname.replace("www.", "");
    }
    catch (e) {
        console.error(e);
        console.error(url);
    }
};
exports.normalizeDomains = normalizeDomains;
//# sourceMappingURL=normaliseDomains.js.map