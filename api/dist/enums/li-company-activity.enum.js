"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiCompanyActivityResultScrapeStatus = exports.LiCompanyActivityScrapeStatus = exports.LiCompanyActivityType = void 0;
var LiCompanyActivityType;
(function (LiCompanyActivityType) {
    LiCompanyActivityType["LIKE"] = "LIKE";
    LiCompanyActivityType["COMMENT"] = "COMMENT";
    LiCompanyActivityType["VISIT"] = "VISIT";
    LiCompanyActivityType["COMPANY_VISIT"] = "COMPANY_VISIT";
    LiCompanyActivityType["COMPANY_FOLLOWER"] = "COMPANY_FOLLOWER";
})(LiCompanyActivityType || (exports.LiCompanyActivityType = LiCompanyActivityType = {}));
var LiCompanyActivityScrapeStatus;
(function (LiCompanyActivityScrapeStatus) {
    LiCompanyActivityScrapeStatus["DRAFT"] = "DRAFT";
    LiCompanyActivityScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiCompanyActivityScrapeStatus["DONE"] = "DONE";
})(LiCompanyActivityScrapeStatus || (exports.LiCompanyActivityScrapeStatus = LiCompanyActivityScrapeStatus = {}));
var LiCompanyActivityResultScrapeStatus;
(function (LiCompanyActivityResultScrapeStatus) {
    LiCompanyActivityResultScrapeStatus["DRAFT"] = "DRAFT";
    LiCompanyActivityResultScrapeStatus["PUBLIC_PROFILE"] = "PUBLIC_PROFILE";
    LiCompanyActivityResultScrapeStatus["COMPANY_PROFILE"] = "COMPANY_PROFILE";
    LiCompanyActivityResultScrapeStatus["RETRY_COMPANY_PROFILE"] = "RETRY_COMPANY_PROFILE";
    LiCompanyActivityResultScrapeStatus["RETRY_PUBLIC_PROFILE"] = "RETRY_PUBLIC_PROFILE";
    LiCompanyActivityResultScrapeStatus["INVALID"] = "INVALID";
    LiCompanyActivityResultScrapeStatus["TRIGGERED"] = "TRIGGERED";
    LiCompanyActivityResultScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiCompanyActivityResultScrapeStatus["SCRAPED"] = "SCRAPED";
    LiCompanyActivityResultScrapeStatus["ERROR"] = "ERROR";
    LiCompanyActivityResultScrapeStatus["WAITING"] = "WAITING";
    LiCompanyActivityResultScrapeStatus["APOLLO_ENRICHED"] = "APOLLO_ENRICHED";
    LiCompanyActivityResultScrapeStatus["APOLLO_PERSON_ENRICHED"] = "APOLLO_PERSON_ENRICHED";
    LiCompanyActivityResultScrapeStatus["DONE"] = "DONE";
})(LiCompanyActivityResultScrapeStatus || (exports.LiCompanyActivityResultScrapeStatus = LiCompanyActivityResultScrapeStatus = {}));
//# sourceMappingURL=li-company-activity.enum.js.map