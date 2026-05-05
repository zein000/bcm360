"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiProfileVisitsResultScrapeStatus = exports.LiProfileVisitsScrapeStatus = exports.LiProfileVisitsType = void 0;
var LiProfileVisitsType;
(function (LiProfileVisitsType) {
    LiProfileVisitsType["LIKE"] = "LIKE";
    LiProfileVisitsType["COMMENT"] = "COMMENT";
    LiProfileVisitsType["VISIT"] = "VISIT";
    LiProfileVisitsType["COMPANY_VISIT"] = "COMPANY_VISIT";
})(LiProfileVisitsType || (exports.LiProfileVisitsType = LiProfileVisitsType = {}));
var LiProfileVisitsScrapeStatus;
(function (LiProfileVisitsScrapeStatus) {
    LiProfileVisitsScrapeStatus["DRAFT"] = "DRAFT";
    LiProfileVisitsScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiProfileVisitsScrapeStatus["DONE"] = "DONE";
})(LiProfileVisitsScrapeStatus || (exports.LiProfileVisitsScrapeStatus = LiProfileVisitsScrapeStatus = {}));
var LiProfileVisitsResultScrapeStatus;
(function (LiProfileVisitsResultScrapeStatus) {
    LiProfileVisitsResultScrapeStatus["DRAFT"] = "DRAFT";
    LiProfileVisitsResultScrapeStatus["PUBLIC_PROFILE"] = "PUBLIC_PROFILE";
    LiProfileVisitsResultScrapeStatus["COMPANY_PROFILE"] = "COMPANY_PROFILE";
    LiProfileVisitsResultScrapeStatus["RETRY_COMPANY_PROFILE"] = "RETRY_COMPANY_PROFILE";
    LiProfileVisitsResultScrapeStatus["RETRY_PUBLIC_PROFILE"] = "RETRY_PUBLIC_PROFILE";
    LiProfileVisitsResultScrapeStatus["INVALID"] = "INVALID";
    LiProfileVisitsResultScrapeStatus["TRIGGERED"] = "TRIGGERED";
    LiProfileVisitsResultScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiProfileVisitsResultScrapeStatus["SCRAPED"] = "SCRAPED";
    LiProfileVisitsResultScrapeStatus["ERROR"] = "ERROR";
    LiProfileVisitsResultScrapeStatus["WAITING"] = "WAITING";
    LiProfileVisitsResultScrapeStatus["APOLLO_ENRICHED"] = "APOLLO_ENRICHED";
    LiProfileVisitsResultScrapeStatus["APOLLO_PERSON_ENRICHED"] = "APOLLO_PERSON_ENRICHED";
    LiProfileVisitsResultScrapeStatus["DONE"] = "DONE";
    LiProfileVisitsResultScrapeStatus["PERSON_FINDING"] = "PERSON_FINDING";
})(LiProfileVisitsResultScrapeStatus || (exports.LiProfileVisitsResultScrapeStatus = LiProfileVisitsResultScrapeStatus = {}));
//# sourceMappingURL=li-profile-visits.enum.js.map