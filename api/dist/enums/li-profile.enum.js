"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiProfileResultScrapeStatus = exports.LiProfileScrapeStatus = exports.LiProfileEntryType = exports.LiProfileType = void 0;
var LiProfileType;
(function (LiProfileType) {
    LiProfileType["POST"] = "POST";
    LiProfileType["COMMENT"] = "COMMENT";
    LiProfileType["LIKE_TO_POST"] = "LIKE_TO_POST";
    LiProfileType["LIKE_TO_COMMENT"] = "LIKE_TO_COMMENT";
    LiProfileType["COMMENT_TO_POST"] = "COMMENT_TO_POST";
})(LiProfileType || (exports.LiProfileType = LiProfileType = {}));
var LiProfileEntryType;
(function (LiProfileEntryType) {
    LiProfileEntryType["LINKEDIN_PROFILE_POSTS"] = "LINKEDIN_PROFILE_POSTS";
    LiProfileEntryType["LINKEDIN_PROFILE_COMMENTS"] = "LINKEDIN_PROFILE_COMMENTS";
    LiProfileEntryType["LINKEDIN_PROFILE_LIKES_TO_POST"] = "LINKEDIN_PROFILE_LIKES_TO_POST";
    LiProfileEntryType["LINKEDIN_PROFILE_LIKES_TO_COMMENT"] = "LINKEDIN_PROFILE_LIKES_TO_COMMENT";
    LiProfileEntryType["LINKEDIN_PROFILE_COMMENTS_TO_POST"] = "LINKEDIN_PROFILE_COMMENTS_TO_POST";
})(LiProfileEntryType || (exports.LiProfileEntryType = LiProfileEntryType = {}));
var LiProfileScrapeStatus;
(function (LiProfileScrapeStatus) {
    LiProfileScrapeStatus["DRAFT"] = "DRAFT";
    LiProfileScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiProfileScrapeStatus["DONE"] = "DONE";
})(LiProfileScrapeStatus || (exports.LiProfileScrapeStatus = LiProfileScrapeStatus = {}));
var LiProfileResultScrapeStatus;
(function (LiProfileResultScrapeStatus) {
    LiProfileResultScrapeStatus["DRAFT"] = "DRAFT";
    LiProfileResultScrapeStatus["PUBLIC_PROFILE"] = "PUBLIC_PROFILE";
    LiProfileResultScrapeStatus["COMPANY_PROFILE"] = "COMPANY_PROFILE";
    LiProfileResultScrapeStatus["RETRY_COMPANY_PROFILE"] = "RETRY_COMPANY_PROFILE";
    LiProfileResultScrapeStatus["RETRY_PUBLIC_PROFILE"] = "RETRY_PUBLIC_PROFILE";
    LiProfileResultScrapeStatus["INVALID"] = "INVALID";
    LiProfileResultScrapeStatus["TRIGGERED"] = "TRIGGERED";
    LiProfileResultScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiProfileResultScrapeStatus["SCRAPED"] = "SCRAPED";
    LiProfileResultScrapeStatus["ERROR"] = "ERROR";
    LiProfileResultScrapeStatus["WAITING"] = "WAITING";
    LiProfileResultScrapeStatus["APOLLO_ENRICHED"] = "APOLLO_ENRICHED";
    LiProfileResultScrapeStatus["APOLLO_PERSON_ENRICHED"] = "APOLLO_PERSON_ENRICHED";
    LiProfileResultScrapeStatus["DONE"] = "DONE";
    LiProfileResultScrapeStatus["PERSON_FINDING"] = "PERSON_FINDING";
})(LiProfileResultScrapeStatus || (exports.LiProfileResultScrapeStatus = LiProfileResultScrapeStatus = {}));
//# sourceMappingURL=li-profile.enum.js.map