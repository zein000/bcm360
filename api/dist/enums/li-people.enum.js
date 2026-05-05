"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiPeopleType = exports.LiPeopleResultScrapeStatus = exports.LiPeopleScrapeStatus = void 0;
var LiPeopleScrapeStatus;
(function (LiPeopleScrapeStatus) {
    LiPeopleScrapeStatus["DRAFT"] = "DRAFT";
    LiPeopleScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiPeopleScrapeStatus["DONE"] = "DONE";
})(LiPeopleScrapeStatus || (exports.LiPeopleScrapeStatus = LiPeopleScrapeStatus = {}));
var LiPeopleResultScrapeStatus;
(function (LiPeopleResultScrapeStatus) {
    LiPeopleResultScrapeStatus["DRAFT"] = "DRAFT";
    LiPeopleResultScrapeStatus["RETRY_PUBLIC_PROFILE"] = "RETRY_PUBLIC_PROFILE";
    LiPeopleResultScrapeStatus["RETRY_COMPANY_PROFILE"] = "RETRY_COMPANY_PROFILE";
    LiPeopleResultScrapeStatus["PUBLIC_PROFILE"] = "PUBLIC_PROFILE";
    LiPeopleResultScrapeStatus["COMPANY_PROFILE"] = "COMPANY_PROFILE";
    LiPeopleResultScrapeStatus["INVALID"] = "INVALID";
    LiPeopleResultScrapeStatus["TRIGGERED"] = "TRIGGERED";
    LiPeopleResultScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiPeopleResultScrapeStatus["SCRAPED"] = "SCRAPED";
    LiPeopleResultScrapeStatus["ERROR"] = "ERROR";
    LiPeopleResultScrapeStatus["WAITING"] = "WAITING";
    LiPeopleResultScrapeStatus["APOLLO_ENRICHED"] = "APOLLO_ENRICHED";
    LiPeopleResultScrapeStatus["APOLLO_PERSON_ENRICHED"] = "APOLLO_PERSON_ENRICHED";
    LiPeopleResultScrapeStatus["DONE"] = "DONE";
    LiPeopleResultScrapeStatus["PERSON_FINDING"] = "PERSON_FINDING";
})(LiPeopleResultScrapeStatus || (exports.LiPeopleResultScrapeStatus = LiPeopleResultScrapeStatus = {}));
var LiPeopleType;
(function (LiPeopleType) {
    LiPeopleType["SEARCH"] = "SEARCH";
    LiPeopleType["SPECIFIC"] = "SPECIFIC";
})(LiPeopleType || (exports.LiPeopleType = LiPeopleType = {}));
//# sourceMappingURL=li-people.enum.js.map