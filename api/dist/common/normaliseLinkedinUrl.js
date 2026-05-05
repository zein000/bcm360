"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCompanyLinkedinUrl = exports.normalizeLinkedinUrl = void 0;
const normalizeLinkedinUrl = (linkedinUrl) => {
    try {
        if (!linkedinUrl)
            return null;
        let url = linkedinUrl.replace("https://", "http://");
        if (url.endsWith("/")) {
            url = url.slice(0, -1);
        }
        url = url.replace(/(http:\/\/)?([a-z0-9-]+\.)*linkedin\.com/, "http://www.linkedin.com");
        const newUrl = new URL(url);
        const path = newUrl.pathname.split("/");
        if (path.length > 2) {
            path.splice(2);
        }
        if ((path === null || path === void 0 ? void 0 : path[0]) === "showcase") {
            path[0] = "company";
        }
        let pathname = newUrl.pathname;
        if (pathname.endsWith("/")) {
            pathname = pathname.slice(0, -1);
        }
        return decodeURI(`${newUrl.protocol}//${newUrl.hostname}${pathname}`);
    }
    catch (e) {
        console.error("Error normalizing LinkedIn URL:", e);
        console.error("Input:", linkedinUrl);
        return null;
    }
};
exports.normalizeLinkedinUrl = normalizeLinkedinUrl;
const normalizeCompanyLinkedinUrl = (linkedinUrl) => {
    try {
        if (!linkedinUrl)
            return null;
        let url = linkedinUrl.replace("https://", "http://");
        if (url.endsWith("/")) {
            url = url.slice(0, -1);
        }
        url = url.replace(/(http:\/\/)?([a-z0-9-]+\.)*linkedin\.com/, "http://www.linkedin.com");
        const newUrl = new URL(url);
        const path = newUrl.pathname.split("/");
        if (path.length > 2) {
            path.splice(2);
        }
        if (path[0] === "showcase") {
            path[0] = "company";
        }
        if (path[0] !== "company") {
            return null;
        }
        return decodeURI(`${newUrl.protocol}//${newUrl.hostname}${newUrl.pathname}`);
    }
    catch (e) {
        console.error("Error normalizing LinkedIn company URL:", e);
        console.error("Input:", linkedinUrl);
        return null;
    }
};
exports.normalizeCompanyLinkedinUrl = normalizeCompanyLinkedinUrl;
//# sourceMappingURL=normaliseLinkedinUrl.js.map